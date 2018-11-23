
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
                            <h4><center><i>ОАРИТ</i></center></h4>
                            <div class="table-left">
                                <table class="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td colspan="2" v-contenteditable:testText="true"></td>
                                            <td v-contenteditable:testText="true"></td>
                                        </tr>
                                        <tr>
                                            <td>t-ра</td>
                                            <td v-contenteditable:testText="true"></td>
                                            <td>0С</td>
                                        </tr>
                                        <tr>
                                            <td>SpO2</td>
                                            <td v-contenteditable:testText="true"></td>
                                            <td>%</td>
                                        </tr>
                                        <tr>
                                            <td>АД</td>
                                            <td v-contenteditable:testText="true"></td>
                                            <td>мм.рт.ст.</td>
                                        </tr>
                                        <tr>
                                            <td>ЧСС</td>
                                            <td v-contenteditable:testText="true"></td>
                                            <td>в мин</td>
                                        </tr>
                                        <tr>
                                            <td>ЦВД</td>
                                            <td v-contenteditable:testText="true"></td>
                                            <td>мм.рт.ст.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p class="content" v-contenteditable:testText="true">
                            </p>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="bottom">
                            <h4>Предполагаемая тактика:</h4>
                            <ul class="tactic" contenteditable="true">
                                <li>Антибактериальная терапия, Гастропротекция</li>
                                <li>Контроль витальных функций, коррекция нарушений ВЭБ</li>
                                <li>Адекватная анальгезия, Симптоматическая терапия</li>
                                <li>Динамическое наблюдение, КЩС, БАК, АЧТВ, коагулограмма</li>
                                <li>ЭКГ, рентгенограмма органов грудной клетки</li>
                                <li>
                                    При стабильно-положительной динамике
                                    - экстубация, перевод в профильное отделение
                                </li>
                            </ul>
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
            testText: 'Test Text',
            parsed: {

            },
        }
    },
    methods: {
        start: function(e) {
            // this.activate()
            $('#main').fadeOut('slow')
        },
        test: function(e) {
            console.log(this.testText)
        },
        update: function(text) {
            // Google API text receive Event
            console.log(text)
        },
        checkApi () {
            window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            if (!SpeechRecognition && process.env.NODE_ENV !== 'production') {
                throw new Error('Speech Recognition does not exist on this browser. Use Chrome or Firefox')
            }
            if (!SpeechRecognition) {
                return
            }
            this.recognition = new SpeechRecognition()
            this.recognition.lang = this.language
            this.recognition.interimResults = true
            this.recognition.addEventListener('result', event => {
                const text = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('')
                this.runtimeTranscription = text
            })
            this.recognition.addEventListener('end', () => {
                if (this.runtimeTranscription !== '') {
                    this.transcription.push(this.runtimeTranscription)
                    this.update(this.transcription)
                }
                this.runtimeTranscription = ''
                this.recognition.start()
            })
            this.recognition.start()
        },
        activate() {
            if (!this.isActive) {
                this.checkApi()
                this.isActive = true
            } else {
                this.isActive = false
                this.recognition.stop()
                this.recognition = null
            }
        },
    },
};
</script>
