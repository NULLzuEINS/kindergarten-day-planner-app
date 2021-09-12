<template>
	<h1>PDF stream</h1>
	<textarea
		v-model="blob"
		cols="72"
		rows="10"
	></textarea>
	<hr>
	<iframe
		border="1"
		:src="blob"
		width="600"
		height="775"
	></iframe>
</template>

<script>
import PDFDocument from ''
import fs from 'fs'
//import blobStream from 'blob-stream'

export default {
  name: 'Pdf',
  components:  {},    
  data() {
    return {
    }
  },
  computed: {
		// Method to genrate PDF file
		blob: async () =>{
			const doc = new PDFDocument()
//			const stream = doc.pipe(blobStream())
			var url
			doc.pipe(fs.createWriteStream('output.pdf'))

			// draw some text
			doc.text("Hello World")

// end and display the document in the iframe to the right
			doc.end();
			
		} 
	}
}
</script>

<style>
	iframe,
	textarea {
		border: 1px solid #000;
	}
</style>
