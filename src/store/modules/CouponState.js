import axios from "axios";

const CouponState = {
    namespaced: true,

    state: {
        coupons: null,
        types: {
            1: '%',
            2: '₪'
        }
    },

    getters: {
        coupons: state => state.coupons,
    },

    mutations: {
        SET_NEW_COUPON(state, couponData) {
            if(!state.coupons) {
                return;
            }

            state.coupons.unshift(couponData);
        },

        SET_COUPONS(state, coupons) {
            state.coupons = coupons;
        },

        DELETE_COUPON(state, coupon_ids) {
            if(state.coupons) {
                state.coupons = state.coupons.filter(coupon => !coupon_ids.includes(coupon.id));
            }
        },
        
        SET_UPDATED_STATUS(state, couponData) {
            if(!state.coupons) {
                return;
            }
            
            const couponIndex = state.coupons.findIndex(coupon => coupon.id === couponData.id);
            if(couponIndex < 0) {
                return;
            }
            
            state.coupons[couponIndex].status = couponData.status;
        },
    },

    actions: {
        getCoupons({ state, commit, dispatch }) {
            commit('SET_COUPONS', null);

            axios.get('cms/coupons')
                .then(res => {
                    const coupons = res.data.data.map(coupon => {
                        return {
                            ...coupon,
                            coupon_value: coupon.value + state.types[coupon.type]
                        }
                    })
                    commit('SET_COUPONS', coupons);
                })
                .catch(err => {
                    dispatch('MessageState/addMessage', {
                        message: 'Failed to fetch Coupons',
                        type: 'error',
                    }, {root:true});
                    console.warn('getCoupons: ', err);
                })
        },

        getCoupon({ state }, couponID) {
            return new Promise((resolve, reject) => {
                if(state.coupons) {
                    resolve(state.coupons.find(coupon => coupon.id == couponID))
                } else {
                    resolve(null)
                }
            })
        },

        async searchByCouponName({dispatch}, searchInput) {
            return await dispatch('searchByInput', {searchInput, field: 'name', field_name: 'coupon name'}); 
        },
                
        searchByInput({state}, data) {
            const results = [];
            state.coupons.forEach(coupon => {
                if(coupon && coupon[data.field]) {
                    const field = coupon[data.field];
                    if(field.toLowerCase().includes(data.searchInput)) {
                        results.push({
                            text: coupon.coupon_number,
                            component: 'Coupon',
                            type: `Coupon's ${data.field_name ? data.field_name : data.field}`,
                            path: `/coupons/show/${coupon.id}` 
                        })
                    }
                }
            });
            return results;  
        },

        updateCouponStatus({ commit }, couponData) {
            return new Promise((resolve, reject) => {
                axios.post('cms/coupons/status/update', couponData)
                    .then(res => {
                        commit('SET_UPDATED_STATUS', couponData);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updateCouponStatus: ', err);
                        reject(err.response.data)
                    })
            }) 
        },
    }
};

export default CouponState;