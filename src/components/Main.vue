<template>
    <div class="wrapper">
        <div id="main">
            <div class="micro">
                <span @click="start"><i class="fa fa-microphone-alt"></i></span>
            </div>
        </div>

        <div class="doc">
            <nav class="navbar fixed-top justify-content-between">
              <a class="navbar-brand" href="#">Arbio</a>
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
                <div class="btn-group" role="group">
                    <button class = "btn btn-danger stop" v-on:click="activate"><span v-if="isActive">Stop</span><span v-else>Start</span></button>
                    <button class="btn btn-success" v-on:click="toDatabase">Insert to Database</button>
                </div>
            </nav>

            <div class="old" v-for="old in oldData">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="top">
                                <h5><center><i>ОАРИТ</i></center></h5>
                                <div class="table-left">
                                    <table class="table table-bordered">
                                        <tbody>
                                            <tr>
                                                <td colspan="2" class="input-hidden" >{{ old.Date }}</td>
                                                <td class="input-hidden" v-html="old.Time"></td>
                                            </tr>
                                            <tr>
                                                <td>t-ра</td>
                                                <td class="input-hidden">{{ old.Temperature }}</td>
                                                <td><sup><small>0</small></sup>С</td>
                                            </tr>
                                            <tr>
                                                <td>SpO<sub><small>2</small></sub></td>
                                                <td class="input-hidden">{{ old.Saturation }}</td>
                                                <td>%</td>
                                            </tr>
                                            <tr>
                                                <td>АД</td>
                                                <td class="input-hidden">{{ old.Pressure }}</td>
                                                <td>мм.рт.ст.</td>
                                            </tr>
                                            <tr>
                                                <td>ЧСС</td>
                                                <td class="input-hidden">{{ old.Pulse }}</td>
                                                <td>в мин</td>
                                            </tr>
                                            <tr>
                                                <td>ЦВД</td>
                                                <td class="input-hidden">{{ old.Svd }}</td>
                                                <td>мм.рт.ст.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p class="content">
                                    <span class="input-hidden">{{ old.Content }}</span>
                                </p>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="bottom" v-show="old.Tactic.length > 0">
                                <h5>Предполагаемая тактика:</h5>
                                <p class="tactic">
                                    <span class="input-hidden">{{ old.Tactic }}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container" id="current">
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
                            <p class="tactic">
                                <span class="input-hidden" v-contenteditable:tactic="true"></span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

            <!-- <span @click="toDatabase"><i class="fas fa-database"></i></span> -->


    </div>
</template>
<script src="https://www.gstatic.com/firebasejs/4.13.0/firebase.js"></script>
<script>
// import {data as dataOriginal} from '@/components/scripts/keywords';
import {Document, Packer, Paragraph} from "docx";
import saveAs from 'file-saver';
import firebase from 'firebase';


const dataOriginal = [{
    'label': 'АД',
    'data': [
        'давление',
        'артериальное давление'
    ]
},
{
    'label': 'За время наблюдения',
    'data': [
        'за время наблюдения',
        'во время наблюдения',
        'в период наблюдения'
    ]
},

{
    'label': 'Предполагаемая тактика',
    'data': [
        'предполагаемая тактика',
        'тактика',
        'дальнейшие действия'
    ]
}, {
    'label': 'Температура',
    'data': [
        'температура'
    ]
}, {
    'label': 'ЧСС',
    'data': [
        'пульс',
        'частота сердечных сокращений'
    ]
}, {
    'label': 'SpO2',
    'data': [
        'сатурация',
        'spo2'
    ]
}, {
    'label': 'ЦВД',
    'data': [
        'венозное давление'
    ]
}, {
    'label': 'Врач',
    'data': [
        'врач'
    ]
}];
export default {
    name: 'Main',
    data() {
        return {
            oldData: [],
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
            time: '13:05',
            temperature: '',
            spo: '',
            ad: '',
            chss: '',
            svd: '',
        }
    },
    methods: {
        start: function (e) {
            this.readDatabase();
            this.data = dataOriginal.slice();
            this.activate();
            $('#main').fadeOut('slow');
            this.isActive = true;
            // this.test();
        },
        test: function() {
            this.update(`Пациент доставлен из операционного блока на продолжающейся ИВЛ, после проведения АКШ+МКШ+УУЛП в условиях ИК. Состояние пациента тяжелое, тяжесть обусловлена ранним послеоперационным периодом, объемом перенесенной операции, основным заболеванием, сопутствующей патологией. Сознание – медикаментозная седация, уровень по шкале RASS -5. Дыхание аппаратное, в режиме BiPAP с FiO2-60% (в режиме нормовентиляции). При осмотре: кожные покровы бледно-розовые, признаков нарушения микроциркуляции нет. В легких жесткое дыхание, проводится по всем полям, хрипы не аускультируются. Гемодинамика стабильная, поддержка Норадреналин 100 нг/кг/мин. Тоны сердца приглушены, ритмичные. По дренажам серозно-геморрагическое отделяемое в умеренном количестве. Живот мягкий, доступен глубокой пальпации. Моча по уретральному катетеру, светлая, диурез адекватен. Предполагаемая тактика Антибактериальная терапия, Гастропротекция Контроль витальных функций, коррекция нарушений ВЭБ Адекватная анальгезия, Симптоматическая терапия Динамическое наблюдение, КЩС, БАК, АЧТВ, коагулограмма ЭКГ, рентгенограмма органов грудной клетки При стабильно-положительной динамике - экстубация, перевод в профильное отделение температура 34,0 сатурация 98 давление 150/170 частота сердечных сокращений 58 венозное давление 12`);
            // this.toDocFile();
        },
        update: function (text) {
            for (var i=0;i<text.length;++i)
            {
                this.text+=text[i];
                if (text[i]!=' ')
                {
                    this.parse();
                }
            }
            this.text+=' ';
        },
        parse: function() {
            var keyword = this.tryToGetKeyword();
            if (keyword.index!=-1) {
                this.data.splice(keyword.index, 1);
                var regEx = new RegExp(keyword.keyword.substring(0, keyword.keyword.length-1), "ig");
                this.text = this.getCurrentField().replace(regEx, '');
                this.updateField();
                this.text = '';
                this.updateCurrentField(keyword);
            }
            this.updateField()
        },
        updateCurrentField: function(keyword) {
            switch(keyword.label) {
                case 'Предполагаемая тактика':
                    this.currentField = 'tactic';
                    break;
                case 'Температура':
                    this.currentField = 'temperature';
                    break;
                case 'АД':
                    this.currentField = 'ad';
                    break;
                case 'SpO2':
                    this.currentField = 'spo';
                    break;
                case 'ЧСС':
                    this.currentField = 'chss';
                    break;
                case 'ЦВД':
                    this.currentField = 'svd';
                    break;
                case 'За время наблюдения':
                    this.currentField = 'content';
                    break;
            }
        },
        updateField: function() {
            switch(this.currentField) {
                case 'content':
                    this.content=this.text;
                    break;
                case 'tactic':
                    this.tactic=this.text;
                    break;
                case 'temperature':
                    this.temperature=this.text;
                    break;
                case 'ad':
                    this.ad=this.text;
                    break;
                case 'spo':
                    this.spo=this.text;
                    break;
                case 'chss':
                    this.chss=this.text;
                    break;
                case 'svd':
                    this.svd=this.text;
                    break;
            }
        },
        getCurrentField: function() {
            switch(this.currentField) {
                case 'content':
                    return this.content;
                case 'tactic':
                    return this.tactic;
                case 'temperature':
                    return this.temperature;
                case 'ad':
                    return this.ad;
                case 'spo':
                    return this.spo;
                case 'chss':
                    return this.chss;
                case 'svd':
                    return this.svd;
            }
        },
        tryToGetKeyword() {
            var text = this.text.toLowerCase(),
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
        toDocFile: function() {
            const doc = new Document();

            const content = new Paragraph(this.content);
            const tactic = new Paragraph(this.tactic);
            // doc.createImage(fs.readFileSync("../images/doch.jpg"));

            doc.addParagraph(content);
            doc.addParagraph(new Paragraph('\n'));
            doc.addParagraph(tactic);

            const packer = new Packer();

            packer.toBlob(doc).then(blob => {
                console.log(blob);
                saveAs(blob, "example.docx");
                console.log("Document created successfully");
            });
        },
        readDatabase() {
            var ref = firebase.database().ref();
            var self = this;
            ref.on("value", function(snapshot) {
                self.oldData = Object.values(snapshot.val()['Patient']);
                window.setTimeout(function() {
                    console.log(self.$refs.current);
                    window.location.hash = '#current';
                }, 1000);
            }, function (error) {
                console.log("Error: " + error.code);
            });
        },
        toDatabase() {
            var database = firebase.database();
            var obj = {'Temperature': this.temperature, 'Saturation': this.spo, 'Pressure':this.ad, 'Pulse': this.chss, 'Svd':this.svd, 'Content': this.content, 'Tactic':this.tactic, 'Date': this.date, 'Time': this.time};
            database.ref('Patient').push(obj);
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
