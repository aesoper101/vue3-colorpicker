<template>
  <div class="home">
    <div class="demo">
      <div class="demo-col">
        <test-picker v-model:color="color" />
      </div>
      <div class="demo-col">
        <test-picker v-model:color="color" />
      </div>
      <div class="demo-col">
        <test-picker />
      </div>
      <div>{{color}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";


@Options({
  components: {}
})
export default class Home extends Vue {
  color = "#000000";

}
</script>
<style lang="scss" scoped>
.demo {
  display: flex;
  flex-direction: row;

  &-col {
    flex: 1;
    margin-right: 20px;
  }
}
</style>
