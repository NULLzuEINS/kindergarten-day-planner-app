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
					ghost-class="dayplanner-ghost"
					chosen-class="dayplanner-choosen"
					:list="itemsAvailable"
          :group="{ name: 'dayplanner', pull: 'clone', put: false }"
					itemKey="id"
				>
					<template #item="{ element }">
						<div class="dayplanner-item">
							{{ element.description }}
							<img
								:src="require(`@/assets/images/${element.filename}`)"
								width="100px"
							/>
						</div>
					</template>
				</draggable>
			</div>

			<div class="dayplanner-col">
				<h3>Selected</h3>
				<draggable
					class="dayplanner-group"
					ghost-class="dayplanner-ghost"
					chosen-class="dayplanner-choosen"
					:list="itemsSelected"
					group="dayplanner"
					@change="persist"
					itemKey="id">
					<template #item="{ element }">
						<div class="dayplanner-item">{{ element.description }}</div>
					</template>
				</draggable>
			</div>
			<div class="dayplanner-col">
				<h3>Bin</h3>
				<draggable
					class="dayplanner-group"
					ghost-class="dayplanner-ghost"
					chosen-class="dayplanner-choosen"
          :group="{ name: 'dayplanner', pull: true, put: true }"
          :list="itemsDeleted"
					@change="persist"
					itemKey="id">
					<template #item="{ element }">
						<div class="dayplanner-item">{{ element.description }}</div>
					</template>
				</draggable>
			</div>

		</div>
	</div>
	<h4>Items available</h4>
	<code>{{itemsAvailable}}</code>
	<hr>
	<h4>Items selected</h4>
	<code>{{itemsSelected}}</code>
	<hr>
	<button @click="generatePdf()">generate PDF</button>
</template>

<script>
import draggable from 'vuedraggable'
import jsPDF from 'jspdf'
import images from '../store/images'

export default {
  name: 'DayPlanner',
  components:  {
    draggable,
  },
  data() {
    return {
      itemsAvailable: images,
      itemsDeleted: [],
      itemsSelected: [],
    }
  },
  computed: {
    myList: {
        get() {
            return JSON.parse(localStorage.getItem('myList')) || []
        },
        set(value) {
            localStorage.setItem('myList', JSON.stringify(value))
        }
    }
  },
  methods: {
    generatePdf: function() {
      let doc = new jsPDF();
      this.itemsSelected.forEach(async (item) => {
        doc.addImage(require(`@/assets/images/${item.filename}`), 'JPEG', 15, 30, 180, 120);
        doc.addPage()
      })
      // Save the PDF
      doc.save('test.pdf')
      // Return the PDF as a blob
      doc.output('blob')
    },
    persist: function() {
      window.localStorage.itemsSelected = JSON.stringify(this.itemsSelected)
    }
  },
  mounted() {
    if (window.localStorage.itemsSelected) {
      this.itemsSelected = JSON.parse(window.localStorage.itemsSelected)
    }
  }
}
</script>


<style scoped lang="css">
	.dayplanner {
		border: red solid 1px;
	}
	.dayplanner-row {
		display: grid;
		grid-auto-flow: column;
	}
	.dayplanner-col {
		flex: 1;
		height: 100%;
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
		position: relative;
	}
	.dayplanner-item:active {
		cursor: grabbing;
	}
	.dayplanner-item > input {
		width: 6em;
		line-height: 1;
		height: 1.8em;
		padding: 0.5em;
		border: 1px solid #ccc;
		color: #444;
		position: absolute;
		right: 1rem;
		top: 0;
		bottom: 0;
	}
	.dayplanner-ghost {
		background-color: #ccc;
	}
</style>
