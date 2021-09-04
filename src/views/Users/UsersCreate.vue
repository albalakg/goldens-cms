<template>
    <v-container fluid>
        <v-card class="py-2 pl-5">
            <h1 class="font_title">
                Create User
            </h1>
        </v-card>
        
        <br>

        <v-form @submit.prevent="submit()">
            <v-flex d-flex>
                <v-flex md12 lg6 class="pr-5">
                    <FormCard
                        title="Private Details"
                    >
                        <template slot="content">
                            <div class="px-4">
                                <v-flex d-flex>
                                    <v-text-field
                                        outlined
                                        v-model="form.first_name"
                                        label="First Name"
                                        class="pr-2"
                                    ></v-text-field>
                                    <v-text-field
                                        class="pl-2"
                                        outlined
                                        v-model="form.last_name"
                                        label="Last Name"
                                    ></v-text-field>
                                </v-flex>
                                <v-text-field
                                    outlined
                                    v-model="form.phone"
                                    label="Phone"
                                ></v-text-field>
                                <v-select
                                    outlined
                                    :items="genders"
                                    item-text="text"
                                    item-value="value"
                                    v-model="form.gender"
                                    label="Gender"
                                ></v-select>
                                <v-menu
                                    ref="menu"
                                    v-model="form.birthdate"
                                    :close-on-content-click="false"
                                    :return-value.sync="date"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        outlined
                                        v-model="date"
                                        label="Birthdate"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="date"
                                        no-title
                                        scrollable
                                    >
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="menu = false"
                                    >
                                        Cancel
                                    </v-btn>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="$refs.menu.save(date)"
                                    >
                                        OK
                                    </v-btn>
                                    </v-date-picker>
                                </v-menu>
                                <!-- <v-date-picker 
                                    v-model="form.birthdate" 
                                    :landscape="true" 
                                    :reactive="true"
                                ></v-date-picker> -->
                            </div>
                        </template>
                    </FormCard>
                </v-flex>
                <v-flex md12 lg6 class="pl-5">
                    <FormCard
                        title="Authentication Details"
                    >
                        <template slot="content">
                            <div class="px-4">
                                <v-text-field
                                    outlined
                                    v-model="form.email"
                                    label="Email"
                                ></v-text-field>
                                <v-text-field
                                    type="password"
                                    outlined
                                    v-model="form.password"
                                    label="Password"
                                    autocomplete="new-password"
                                ></v-text-field>
                                <v-text-field
                                    type="password"
                                    outlined
                                    v-model="form.password_confirmation"
                                    label="Password Confirmation"
                                ></v-text-field>
                                <v-select
                                    outlined
                                    :items="roles"
                                    v-model="form.role"
                                    label="Role"
                                ></v-select>
                            </div>
                        </template>
                    </FormCard>
                </v-flex>
            </v-flex>
            <v-flex d-flex justify-space-between class="mt-10">
                <v-flex md12 lg6 class="pr-5">
                    <CancelButton 
                    />
                </v-flex>
                <v-flex md12 lg6 class="pl-5">
                    <SubmitButton
                        @submit="submit()"
                    />
                </v-flex>
            </v-flex>
        </v-form>

    </v-container>
</template>

<script>
import FormCard from './../../components/Cards/FormCard.vue'
import SubmitButton from './../../components/Buttons/SubmitButton.vue'
import CancelButton from './../../components/Buttons/CancelButton.vue'

const NORMAL_ROLE = 'Normal';
const ADMIN_ROLE = 'Admin';

export default {
    components: {
        FormCard,
        SubmitButton,
        CancelButton,
    },

    data() {
        return {
            form: {
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                gender: 1,
                birthdate: '',
                role: NORMAL_ROLE,
            },
            date: '',
            menu: false,
            roles: [
                NORMAL_ROLE,
                ADMIN_ROLE
            ],
            genders: [
                {
                    value: 1,
                    text: 'Male',
                },
                {
                    value: 2,
                    text: 'Female',
                },
                {
                    value: 3,
                    text: 'Unknown',
                },
            ]
        }
    },

    methods: {
        submit() {
            console.log('submit', this.form);
        }
    }
}
</script>

<style scoped>
</style>