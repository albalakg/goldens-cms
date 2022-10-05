<template>
    <v-container fluid class="equipment_show_wrapper">
        
        <div v-if="editedEquipment">
            <TopCard 
                :text="'Equipment ' + editedEquipment.name"
            />

            <br>
            
            <v-tabs vertical class="equipment_show_card">
                <template v-for="(tab, index) in tabs">
                    <v-tab :key="index">
                        {{tab.text}}
                    </v-tab>
                </template>

                <template v-for="(tab, index) in tabs">
                    <v-tab-item :key="index">

                        <div class="pl-5">
                            <component :equipment="editedEquipment" :is="tab.component" />
                        </div>
                    </v-tab-item>
                </template>
            </v-tabs>
        </div>

        <FormLoader v-else />

    </v-container>
</template>

<script>
import FormLoader from '../../../components/Loaders/FormLoader.vue'
import TopCard from '../../../components/Cards/TopCard.vue'
import EquipmentDetails from '../../../components/Equipment/EquipmentDetails.vue'

export default {
    components: {
        FormLoader,
        TopCard,
        EquipmentDetails,
    },

    data() {
        return {
            tabs: [
                { 
                    text: 'Details', 
                    component: 'EquipmentDetails', 
                },
            ],
            editedEquipment: null,
        }
    },

    created() {
        return this.getEquipment();
    },

    watch: {
        equipment() {
            this.getEquipment();
        }
    },

    computed: {
        equipment() {
            return this.$store.getters['EquipmentState/equipment'];
        }
    },

    methods: {
        async getEquipment() {
            this.editedEquipment = await this.$store.dispatch('EquipmentState/getSingleEquipment', this.$route.params.equipmentID);
        },

        submit() {
            this.errors = null;
            if(!this.$refs.form.validate()) {
                return;
            }

            this.loading = true;
            
            this.$store.dispatch('EquipmentState/createEquipment', this.form)
                .then(() => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Equipment ${this.form.first_name} ${this.form.last_name} created successfully`
                    });
                    this.$router.push('/equipment')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the equipment',
                        type: 'error',
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
}
</script>

<style scoped>

    .equipment_show_card {
        min-height: 70vh;
    }

    ::v-deep .v-window {
        background-color: #eeeef1 !important;
    }

</style>