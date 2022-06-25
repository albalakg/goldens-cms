<template>
  <v-container fluid>
    <TopCard text="Create Coupons" />

    <br />

    <v-form @submit.prevent="submit()" ref="form">
      <v-flex xs12 md6 d-flex>
        <v-flex>
          <FormCard title="Details">
            <template slot="content">
              <v-flex class="px-4">
                <v-select
                  outlined
                  :items="types"
                  v-model="form.type"
                  label="Payment Type"
                  :rules="[rules.coupon_type]"
                  class="pr-4"
                ></v-select>

                <v-text-field
                  outlined
                  v-model="form.value"
                  label="Value"
                  class="pl-4"
                  :rules="[rules.value]"
                ></v-text-field>
              </v-flex>
            </template>
          </FormCard>
        </v-flex>
      </v-flex>

      <v-flex d-flex justify-space-between class="mt-10">
        <v-flex md12 lg6 class="pr-5">
          <CancelButton goBack />
        </v-flex>
        <v-flex md12 lg6 class="pl-5">
          <SubmitButton :loading="loading" @submit="submit()" />
        </v-flex>
      </v-flex>
    </v-form>
  </v-container>
</template>

<script>
import FormCard from "../../../components/Cards/FormCard.vue";
import TopCard from "../../../components/Cards/TopCard.vue";
import SubmitButton from "../../../components/Buttons/SubmitButton.vue";
import CancelButton from "../../../components/Buttons/CancelButton.vue";
import { PRICE_RULE, COUPON_TYPE_RULE } from "../../../helpers/Rules";
import { PRICE_MESSAGE, COUPON_TYPE_MESSAGE } from "../../../helpers/Messages";
import { COUPON_TYPES } from "../../../helpers/Status";

export default {
  components: {
    FormCard,
    TopCard,
    SubmitButton,
    CancelButton,
  },

  data() {
    return {
      form: {
        type: "",
        value: "",
      },
      loading: false,
      errors: null,
      rules: {
        value:          (v) => PRICE_RULE.test(v)       || PRICE_MESSAGE,
        coupon_type:    (v) => COUPON_TYPE_RULE.test(v) || COUPON_TYPE_MESSAGE,
      },
      types: COUPON_TYPES,
    };
  },

  methods: {
    submit() {
      this.errors = null;
      if (!this.$refs.form.validate() || this.errors) {
        return;
      }

      this.loading = true;

      this.$store
        .dispatch("CouponState/createCoupon", this.form)
        .then((res) => {
          this.$store.dispatch("MessageState/addMessage", {
            message: `Coupon ${this.form.name} created successfully`,
          });

          this.$router.push("/content/coupons");
        })
        .catch((err) => {
          this.errors = err.errors;
          this.$store.dispatch("MessageState/addMessage", {
            message: "Failed to create the Coupon",
            type: "error",
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
