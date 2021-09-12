<template>
	<h1>Day planner</h1>
	<div
		class="dayplanner"
		ref="testHtml"
	>
		<div class="dayplanner-row">
			<div class="dayplanner-col">
				<h3>None selected</h3>
				<draggable
					class="dayplanner-group"
					:list="list1"
					group="people"
					@change="log"
					itemKey="name"
				>
					<template #item="{ element, index }">
						<div class="dayplanner-item">{{ element.name }} {{ index }}</div>
					</template>
				</draggable>
			</div>

			<div class="dayplanner-col">
				<h3>Selected</h3>
				<draggable
					class="dayplanner-group"
					:list="list2"
					group="people"
					@change="log"
					itemKey="name"
				>
					<template #item="{ element, index }">
						<div class="dayplanner-item">{{ element.name }} {{ index }}</div>
					</template>
				</draggable>
			</div>

			<rawDisplayer
				:class="item"
				:value="list1"
				title="List 1"
			/>

			<rawDisplayer
				:class="item"
				:value="list2"
				title="List 2"
			/>

		</div>
	</div>
	<button	@click="generatePdf()">generate PDF</button>
</template>

<script>
import draggable from 'vuedraggable'
import jsPDF from 'jspdf'

export default {
  name: 'DayPlanner',
  components:  {
    draggable,
  },    
  data() {
    return {
      list1: [
        { name: "John", id: 1 },
        { name: "Joao", id: 2 },
        { name: "Jean", id: 3 },
        { name: "Gerard", id: 4 },
		{ name: "Juan", id: 5 },
        { name: "Edgard", id: 6 },
        { name: "Johnson", id: 7 }
      ],
      list2: []
    }
  },
  methods: {
    add: function() {
      this.list.push({ name: "Juan" });
    },
    log: function(evt) {
      window.console.log(evt);
    },
	generatePdf: async () => {
		return new Promise((resolve) => {
			// Create a new instance of jsPDF
			var doc = new jsPDF()
			
			// Add text to PDF
			doc.text(20, 20, 'Hello world!')
			
			// Save the PDF
			doc.save('test.pdf')

			// Return the PDF as a blob
			resolve(doc.output('blob'))
			})
		}
	}
}
</script>


<style scoped lang="css">
	.dayplanner {
		border: red solid 1px;
	}
	.dayplanner-row {
		display: flex;
	}
	.dayplanner-col {
		flex: 1;
		border: 1px solid #ccc;
	}

	.dayplanner-group {
		border: 1px solid #ccc;
		min-height: 100px;
		min-width: 100px;
		background-color: #eee;
		padding: 10px 10px 42px;
	}
	.dayplanner-item {
		padding: 10px;
		border: 1px solid #ccc;
		margin: 5px;
		background-color: #eee;
		cursor: grab;
	}
</style>
