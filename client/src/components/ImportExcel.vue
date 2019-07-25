<template>
  <div>
    <a href="javascript:;" class="file"
      >导入表格
      <input
        id="upload"
        type="file"
        @change="importfxx(this)"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
    </a>
  </div>
</template>

<script>
export default {
  data () {
    return {
      excelData:[]
    }
  },
  methods: {
    importfxx(obj) {
      let _this = this;  
      this.file = event.currentTarget.files[0];  
      var rABS = false; //是否将文件读取为二进制字符串  
      var file = this.file; 

      FileReader.prototype.readAsBinaryString = function(f) {  
        var binary = "";  
        var rABS = false; //是否将文件读取为二进制字符串  
        var pt = this;  
        var workbook; //读取完成的数据  
        // var excelData;  
        var reader = new FileReader(); 
        reader.onprogress = function(e) { 
          let total = file.size;
          _this.progress = (e.loaded/total)*100;
          console.log( _this.progress);
        };   
        reader.onload = function(e) {
          try {
            var bytes = new Uint8Array(reader.result);  
            var length = bytes.byteLength;  
            for(var i = 0; i < length; i++) {  
              binary += String.fromCharCode(bytes[i]);  
            }  
            if(rABS) {  
              workbook = XLSX.read(btoa(fixdata(binary)), { //手动转化  
                type: 'base64'  
              });  
            }else {  
              workbook = XLSX.read(binary, {  
                type: 'binary'  
              });  
            } 
            // excelData = []; 
          } catch(e) {
            console.log('文件类型不正确');
            return;
          }
          var fromTo = '';
          for (var sheet in workbook.Sheets) {
            if (workbook.Sheets.hasOwnProperty(sheet)) {
              fromTo = workbook.Sheets[sheet]['!ref'];
              _this.excelData = _this.excelData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            }
          }
          console.log(_this.excelData);
        };

        reader.readAsArrayBuffer(f);  

      } 
 
      var reader = new FileReader();
      if(rABS) {  
        reader.readAsArrayBuffer(file);  
      }else {  
        reader.readAsBinaryString(file);  
      } 

      
    },
  }
}
</script>

<style>
</style>
