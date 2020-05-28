import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ScreenBreakPointsControl extends Vue {

    screenWidth: number = document.getElementById('app')!.offsetWidth;
    documentHeight: number = document.body.clientHeight;
    screenHeight: number = window.screen.height;

    get navbarBreakPoint(): boolean {
        return this.screenWidth < 765;
    }

    get langChangeBreakPoint(): boolean {
        return this.screenWidth < 460;
    }

    get fontSize() {
        if (this.$vuetify.breakpoint.xsOnly) {
            return 'display-1';
        } else if (this.$vuetify.breakpoint.smOnly || this.$vuetify.breakpoint.mdOnly) {
            return 'display-2';
        } else if (this.$vuetify.breakpoint.lgOnly) {
            return 'display-3';
        } else {
            return 'display-4';
        }
    }

    private get binding() {
        const binding: { [key: string]: boolean } = {};

        if (this.$vuetify.breakpoint.mdAndUp) {
            binding.row = true;
        } else {
            binding.column = true;
        }

        return binding;
    }

    mounted(): void {
        window.addEventListener('resize', () => {
            this.screenWidth = document.getElementById('app')!.offsetWidth;
            this.documentHeight = document.body.clientHeight;
            this.screenHeight = window.screen.height;
        });
    }

    beforeDestroy(): void {
        window.removeEventListener('resize', () => {
            this.screenWidth = document.getElementById('app')!.offsetWidth;
            this.documentHeight = document.body.clientHeight;
            this.screenHeight = window.screen.height;
        });
    }

}
