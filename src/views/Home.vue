<template>
  <div>
    <div>
      <input ref="url">
    </div>
    <div>
      <button @click="openUrl">open</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({
    components: {
        HelloWorld
    }
})
export default class Home extends Vue {
    mounted() {
        document.getElementsByTagName('input')[0].value = 'https://devexpress.github.io/testcafe/example/';
        (window as any).processData = this.processData;
    }

    openUrl() {
        console.log((this.$refs.url as any).value);

        (window as any).ipcRenderer.send(
            'startRecording',
            (this.$refs.url as any).value
        );
        (window as any).ipcRenderer.on('sendRecordingData', (
            event: any,
            arg: any
        ) => {
            console.log(arg);
        });
    }

    processData(data: any) {
        console.log(data);
    }
}
</script>
