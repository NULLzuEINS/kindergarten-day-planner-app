<template>
	<h1>PDF stream</h1>
	<button @click="generatePDF()">Generate PDF</button>
</template>

<script>
import jsPDF from 'jspdf'

export default {
	name: 'Pdf',
	components:  {},    
	methods: {
		generatePDF: async () => {
			return new Promise((resolve) => {
				// Create a new instance of jsPDF
				var doc = new jsPDF();
				// Add text to PDF
				doc.text(20, 20, 'Hello world!');
				// Save the PDF
				doc.save('test.pdf');

				console.log(doc.output('datauristring'))
				// Return the PDF as a blob
				resolve(doc.output('blob'))
			})
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
