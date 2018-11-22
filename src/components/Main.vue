
<template>
    <div class="wrapper">
        <div class="main">
            <div class="micro">
                <i class="fas fa-microphone-alt"></i>
            </div>
        </div>
        <div class="doc">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <div class="top">
                            <h4><center><i>ОАРИТ</i></center></h4>
                            <div class="table-left">
                                <table class="table table-bordered" contenteditable="true">
                                    <tbody>
                                        <tr>
                                            <td colspan="2">29.10.2018</td>
                                            <td>1305</td>
                                        </tr>
                                        <tr>
                                            <td>t-ра</td>
                                            <td>34,0</td>
                                            <td>0С</td>
                                        </tr>
                                        <tr>
                                            <td>SpO2</td>
                                            <td>98</td>
                                            <td>%</td>
                                        </tr>
                                        <tr>
                                            <td>АД</td>
                                            <td>150/70</td>
                                            <td>мм.рт.ст.</td>
                                        </tr>
                                        <tr>
                                            <td>ЧСС</td>
                                            <td>58</td>
                                            <td>в мин</td>
                                        </tr>
                                        <tr>
                                            <td>ЦВД</td>
                                            <td>12</td>
                                            <td>мм.рт.ст.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p class="content" contenteditable="true">
                                    Пациент доставлен из операционного блока на продолжающейся ИВЛ, после проведения АКШ+МКШ+УУЛП в условиях ИК.
                                Состояние пациента тяжелое, тяжесть обусловлена ранним послеоперационным периодом, объемом перенесенной операции, основным заболеванием, сопутствующей патологией.
                                Сознание – медикаментозная седация, уровень по шкале RASS -5. Дыхание аппаратное, в режиме BiPAP с FiO2-60% (в режиме нормовентиляции). При осмотре: кожные покровы бледно-розовые, признаков нарушения микроциркуляции нет. В легких жесткое дыхание, проводится по всем полям, хрипы не аускультируются. Гемодинамика стабильная, поддержка Норадреналин 100 нг/кг/мин. Тоны сердца приглушены, ритмичные. По дренажам серозно-геморрагическое отделяемое в умеренном количестве. Живот мягкий, доступен глубокой пальпации. Моча по уретральному катетеру, светлая, диурез адекватен.
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
                                <li>При стабильно-положительной динамике - экстубация, перевод в профильное отделение</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="https://www.gstatic.com/firebasejs/4.13.0/firebase.js"></script>
<script>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBuKK7PR3RR0eheOHnIVBhWkzCDZSNfyJg",
    authDomain: "swift-capsule-221215.firebaseapp.com",
    databaseURL: "https://swift-capsule-221215.firebaseio.com/",
    projectId: "swift-capsule-221215",
    storageBucket: "",
  };
  firebase.initializeApp(config);
</script>
<script>
import {data as dataOriginal} from '@/components/scripts/keywords'
import firebase from 'firebase'
export default {
  name: 'Main',
  data() {
    return {
      recognition: null,
      runtimeTranscription: '',
      transcription: [],
      text: '',
      previousData: {index: -1},
      parsed: [],
      data: [],
      buffer: '',
      type: String,
      language: 'ru-RU',
      isActive: false,
      isNext: false,
      array: [],
    }
  },
  methods: {
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
          this.$emit('onTranscriptionEnd', {
            transcription: this.transcription,
            lastSentence: this.runtimeTranscription
          })
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
    reset() {
      if (this.transcription <= 0) {
        return
      }
      this.transcription = []
      this.parsed = []
      this.text = ''
      this.buffer = ''
    },
    back() {
      this.isNext = false
      // this.text = this.transcription.join(' ')
      this.previousData=  {index: -1}
      this.buffer = ''
      this.array = []
      // this.data = dataOriginal
      // // this.parsed = []
      // console.log("parsed",this.parsed)
      // console.log("buffer ",this.buffer)
      // console.log("text",this.text)
      // console.log("transcription",this.transcription)
      // console.log("data",this.data)
    },
    next() {
      if (this.transcription.length <= 0) {
        return
      }
      // if (this.text.length == 0){
        this.text = this.transcription.join(' ')
        this.isNext = true
        this.data = dataOriginal.slice()
        this.parsed = []
        this.parseText()
        console.log("parsed",this.parsed)
        console.log("buffer ",this.buffer)
        console.log("text",this.text)
        console.log("transcription",this.transcription)
        console.log("data",this.data)
      // }
      // else{
      //   this.text = this.transcription.join(' ')
      //   this.previousData=  {index: -1}
      //   this.buffer = ''
      //   this.array = []
      //   this.data = dataOriginal
      //   this.parsed = []
      //   this.isNext = true
      //   console.log("parsed",this.parsed)
      //   console.log("buffer ",this.buffer)
      //   console.log("text",this.text)
      //   console.log("transcription",this.transcription)
      //   console.log("data",this.data)
      //
      //   this.parseText()
      // }
    },
    parseText() {
      let temporary = ""
      for (let i = 0; i < this.text.length; i++) {
        this.buffer += this.text[i]
        if (this.text[i] !== ' ') {
          let current = this.tryToGetKeyword()
          if (current.index !== -1) {
            if (this.previousData.index !== -1) {
              temporary = this.buffer.substr(0, current.position)
              this.parsed.push(this.getNormalizedValue(temporary))
              this.buffer = this.buffer.replace(temporary, '')
            }
            this.previousData = current
          }
        }
      }
      this.parsed.push(this.getNormalizedValue(this.buffer))

      this.data.forEach((el) => {
          this.parsed.push({keyword: el.label, value: 'нет'});
      })
      // console.log(this.parsed)
    },
    copy(mainObj) {
      let objCopy = {}; // objCopy will store a copy of the mainObj
      let key;

      for (key in mainObj) {
        objCopy[key] = mainObj[key]; // copies each property to the objCopy object
      }
      return objCopy;
    },
    insert(){
       // console.log(this.parsed)
      for(var i = 0; i<this.parsed['length']; i++){
        if (this.parsed[i].keyword === 'пол'){
          this.array.push({'Пол' : this.parsed[i].value})
        }
        if (this.parsed[i].keyword === 'дата рождения'){
          var val = this.parsed[i].value
          var splitted_date = val.split(" ");
          // console.log(splitted_date, val)
          var year = splitted_date[2];
          var age = 2018 - parseInt(year);
          this.array.push({'Возраст' : age});
        }
        if (this.parsed[i].keyword === 'предварительный диагноз'){
            this.array.push({'Диагноз' : this.parsed[i].value});
        }
      }
      console.log(this.array)
      var database = firebase.database();

      database.ref('ids').set(this.array)
      // console.log(database)
    },
    tryToGetKeyword() {
      let maximumLength = 0
      let dataIndex = -1
      let index = -1
      let position = -1
      let temporary = ''
      let value

      for (let i = 0; i < this.data.length; i++) {
        let element = this.data[i]
        element.data.forEach((keyword) => {
          index = this.buffer.toLowerCase().indexOf(keyword.toLowerCase())
          if (index !== -1) {
            if (maximumLength < keyword.length) {
              position = index
              maximumLength = keyword.length
              dataIndex = i
            }
          }
        })
      }
      if (dataIndex !== -1) {
        temporary = this.data[dataIndex].data.slice()
        value = this.data[dataIndex].label
        this.data.splice(dataIndex, 1)
      }
      return {
        value: value,
        keywords: temporary,
        index: dataIndex,
        position: position
      }
    },
    getNormalizedValue(value) {
      let maximumLength = 0
      let maximumKeyword = ''
      let index

      for (let i in this.previousData.keywords) {
        let keyword = this.previousData.keywords[i]
        index = value.toLowerCase().indexOf(keyword.toLowerCase())
        if (index !== -1) {
          if (maximumLength < keyword.length) {
            maximumLength = keyword.length
            maximumKeyword = keyword
          }
        }
      }
      return {
        keyword: this.previousData.value,
        value: value.toLowerCase().replace(maximumKeyword.toLowerCase(), '').replace(/^\s+|\s+$/gm, '')
      }
    },
    capitalize(text) {
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    }
  }
}
</script>
