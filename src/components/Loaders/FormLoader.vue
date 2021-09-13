<template>
    <div>
        <v-flex>
            <v-skeleton-loader
                type="article"
                class="w100"
                height="70"
            ></v-skeleton-loader>
        </v-flex>
        <br>
        <v-flex d-flex>
            <v-flex xs6 class="mr-3">
                <v-sheet
                    color="darken"
                    class="pa-3 w100"
                >
                    <v-skeleton-loader
                        class="mx-auto"
                        type="card"
                    ></v-skeleton-loader>
                </v-sheet>  
            </v-flex>
            <v-flex xs6 class="ml-3">
                <v-sheet
                    color="darken"
                    class="pa-3 w100"
                >
                    <v-skeleton-loader
                        class="mx-auto"
                        type="card"
                    ></v-skeleton-loader>
                </v-sheet> 
            </v-flex>
        </v-flex>
    </div>
</template>
