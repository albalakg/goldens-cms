import axios from "axios";

const OrderState = {
    namespaced: true,

    state: {
        orders: null,
    },

    getters: {
        orders: state => state.orders,
    },

    mutations: {
        SET_ORDERS(state, orders) {
            state.orders = orders;
        },
        
        SET_UPDATED_STATUS(state, orderData) {
            if(!state.orders) {
                return;
            }
            
            const orderIndex = state.orders.findIndex(order => order.id === orderData.id);
            if(orderIndex < 0) {
                return;
            }
            
            state.orders[orderIndex].status = orderData.status;
        },
    },

    actions: {
        getOrders({ commit, dispatch }) {
            return new Promise((resolve) => {

                commit('SET_ORDERS', null);

                axios.get('cms/orders')
                    .then(res => {
                        commit('SET_ORDERS', res.data.data);
                    })
                    .catch(err => {
                        dispatch('MessageState/addMessage', {
                            message: 'Failed to fetch Orders',
                            type: 'error',
                        }, {root:true});
                        console.warn('getOrders: ', err);
                    })
                    .finally(() => {
                        resolve()
                    })
            })
        },

        getOrder({ state }, orderID) {
            return new Promise((resolve, reject) => {
                if(state.orders) {
                    resolve(state.orders.find(order => order.id == orderID))
                } else {
                    resolve(null)
                }
            })
        },

        async searchByOrderNumber({dispatch}, searchInput) {
            return await dispatch('searchByInput', {searchInput, field: 'order_number', field_name: 'order number'}); 
        },
                
        searchByInput({state}, data) {
            const results = [];
            state.orders.forEach(order => {
                if(order && order[data.field]) {
                    const field = order[data.field];
                    if(field.toLowerCase().includes(data.searchInput)) {
                        results.push({
                            text: order.order_number,
                            component: 'Order',
                            type: `Order's ${data.field_name ? data.field_name : data.field}`,
                            path: `/orders/show/${order.id}` 
                        })
                    }
                }
            });
            return results;  
        },

        updateOrderStatus({ commit }, orderData) {
            return new Promise((resolve, reject) => {
                axios.post('cms/orders/status/update', orderData)
                    .then(res => {
                        commit('SET_UPDATED_STATUS', orderData);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updateOrderStatus: ', err);
                        reject(err.response.data)
                    })
            }) 
        },
    }
};

export default OrderState;
