import CrudTable from "./CrudTable/index.vue";
import SelectTable from "./SelectTable/index.vue";

export default {
  install(app: any) {
    app.component("CrudTable", CrudTable);
    app.component("SelectTable", SelectTable);
  }
};
