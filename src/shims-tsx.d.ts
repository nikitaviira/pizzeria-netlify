import Vue, { VNode } from 'vue';

declare global {
  namespace JSX {
    // tslint:disable interface-name no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface interface-name
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
