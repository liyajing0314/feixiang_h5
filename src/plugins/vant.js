// 按需全局引入 vant组件
import Vue from 'vue'
import { Button,List, Cell, Tabbar, TabbarItem,Popup,Form,Field,Toast,Grid, GridItem,NavBar,Dialog,Calendar,IndexBar,IndexAnchor,Search,Checkbox,CheckboxGroup    } from 'vant'
Vue.use(Button)
Vue.use(Cell)
Vue.use(List)
Vue.use(Tabbar).use(TabbarItem)
Vue.use(Popup);
Vue.use(Form);
Vue.use(Field);
Vue.use(Toast);
Vue.use(Grid).use(GridItem)
Vue.use(NavBar)
Vue.use(Dialog)
Vue.use(Calendar)
Vue.use(IndexBar).use(IndexAnchor)
Vue.use(Search);
Vue.use(Checkbox).use(CheckboxGroup);
