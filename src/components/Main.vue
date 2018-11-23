<template>
    <div class="wrapper">
        <div id="main">
            <div class="micro">
                <span @click="start"><i class="fa fa-microphone-alt"></i></span>
            </div>
        </div>
        <div class="doc">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <div class="top">
                            <h5><center><i>ОАРИТ</i></center></h5>
                            <div class="table-left">
                                <table class="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td colspan="2" class="input-hidden" v-contenteditable:date="true"></td>
                                            <td class="input-hidden" v-contenteditable:time.dangerousHTML="true"></td>
                                        </tr>
                                        <tr>
                                            <td>t-ра</td>
                                            <td class="input-hidden" v-contenteditable:temperature="true"></td>
                                            <td><sup><small>0</small></sup>С</td>
                                        </tr>
                                        <tr>
                                            <td>SpO<sub><small>2</small></sub></td>
                                            <td class="input-hidden" v-contenteditable:spo="true"></td>
                                            <td>%</td>
                                        </tr>
                                        <tr>
                                            <td>АД</td>
                                            <td class="input-hidden" v-contenteditable:ad="true"></td>
                                            <td>мм.рт.ст.</td>
                                        </tr>
                                        <tr>
                                            <td>ЧСС</td>
                                            <td class="input-hidden" v-contenteditable:chss="true"></td>
                                            <td>в мин</td>
                                        </tr>
                                        <tr>
                                            <td>ЦВД</td>
                                            <td class="input-hidden" v-contenteditable:svd="true"></td>
                                            <td>мм.рт.ст.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p class="content">
                                <span class="input-hidden" v-contenteditable:content="true"></span>
                            </p>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="bottom" v-show="tactic.length > 0">
                            <h5>Предполагаемая тактика:</h5>
                            <p class="tactic input-hidden" v-contenteditable:tactic="true">
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Main',
    data() {
        return {
            recognition: null,
            runtimeTranscription: '',
            transcription: [],
            language: 'ru-RU',
            isActive: false,
            content: 'Говорите ...',
            tactic:'',
            date: '29.10.2018',
            time: '13<sup><small>05</small></sup>',
            temperature: '',
            spo: '',
            ad: '',
            chss: '',
            svd: '',
        }
    },
    methods: {
        start: function (e) {
            // this.activate()
            $('#main').fadeOut('slow');
        },
        test: function (e) {
            console.log(this.testText);
        },
        update: function (text) {
            // Google API text receive Event
            console.log(text);
        },
        checkApi: function () {
            window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.lang = this.language;
            this.recognition.interimResults = true;
            this.recognition.addEventListener('result', (event) => {
                const text = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
                this.runtimeTranscription = text;
            });
            this.recognition.addEventListener('end', () => {
                if (this.runtimeTranscription !== '') {
                    this.transcription.push(this.runtimeTranscription);
                    this.update(this.transcription);
                }
                this.runtimeTranscription = '';
                this.recognition.start();
            });
            this.recognition.start();
        },
        activate() {
            if (!this.isActive) {
                this.checkApi();
                this.isActive = true;
            } else {
                this.isActive = false;
                this.recognition.stop();
                this.recognition = null;
            }
        },
    },
};
</script>
