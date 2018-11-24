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
// import {data as dataOriginal} from '@/components/scripts/keywords'
const dataOriginal = [{
    'label': 'За время наблюдения',
    'data': [
        'за время наблюдения',
        'во время наблюдения',
        'в период наблюдения'
    ]
}, {
    'label': 'АД',
    'data': [
        'давление',
        'артериальное давление'
    ]
}, {
    'label': 'Предполагаемая тактика',
    'data': [
        'предполагаемая тактика',
        'тактика',
        'дальнейшие действия'
    ]
}];
export default {
    name: 'Main',
    data() {
        return {
            data: null,
            recognition: null,
            runtimeTranscription: '',
            language: 'ru-RU',
            isActive: false,
            currentField: 'content',
            text: '',
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
            this.data = dataOriginal.slice();
            this.activate();
            $('#main').fadeOut('slow');
        },
        test: function (e) {
            console.log(this.testText);
        },
        update: function (text) {
            for (var i=0;i<text.length;++i)
            {
                this.text+=text[i];
                this.parse();
            }
            this.text+=' ';
        },
        parse: function() {
            var keyword = this.tryToGetKeyword();
            console.log(keyword);
            if (keyword.index!=-1) {
                this.updateField(keyword);
            }
            console.log(this.currentField);
            switch(this.currentField) {
                case 'content':
                    this.content=this.text;
                    break;
                case 'tactic':
                    this.tactic=this.text;
                    break;
            }
        },
        updateField: function(keyword) {
            switch(keyword.label) {
                case 'Предполагаемая тактика':
                    this.currentField = 'tactic';
                    break;
                case 'тактика2':
                    this.currentField = 'tactic2';
                    break;
            }
        },
        tryToGetKeyword() {
            var text = this.text,
                maxLen = -1,
                maxKeyWord = '',
                label = '',
                index = -1;

            this.data.forEach(function(item, i) {
                item.data.forEach(function(word) {
                    if (text.indexOf(word)!=-1 && maxLen<word.length) {
                        maxLen = word.length;
                        maxKeyWord = word;
                        index = i;
                        label = item.label;
                    }
                });
            });
            return {keyword: maxKeyWord, index: index, label: label};
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
                    this.update(this.runtimeTranscription);
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
