<template>
	<h1>KiTa Tagesplaner</h1>
	<p>Erstellen Sie sich ihren eigenen Tagesplaner. Schieben Sie dazu alle Tagespunkt von der linken- auf die rechte Seite! Wenn sie fertig sind, drücken Sie auf "PDF erstellen".</p>
	<div class="dayplanner">
		<div class="dayplanner-row">
			<div class="dayplanner-col">
				<h3>Verfügbare Tagespunkte</h3>
				<draggable
					class="dayplanner-group"
					ghost-class="dayplanner-ghost"
					chosen-class="dayplanner-choosen"
					tag="ul"
					:list="itemsAvailable"
					:group="{
                                        name: 'dayplanner',
                                        pull: 'clone',
                                        put: false,
                                        sort: false,
                                    }"
					item-key="id"
				>
					<template #item="{ element }">
						<li class="dayplanner-item dayplanner-item--grab">
							<span class="dayplanner-handle"></span>
							<span class="dayplanner-text">{{ element.description }}</span>
						</li>
					</template>
				</draggable>
			</div>

			<div class="dayplanner-col">
				<h3>Ausgewählte Tagespunkte</h3>
				<draggable
					class="dayplanner-group"
					ghost-class="dayplanner-ghost"
					chosen-class="dayplanner-choosen"
					group="dayplanner"
					handle=".dayplanner-handle"
					tag="ol"
					@change="persist"
					:list="itemsSelected"
					item-key="id"
				>
					<template #item="{ element, index }">
						<li class="dayplanner-item">
							<span class="dayplanner-handle"></span>
							<span class="dayplanner-text">{{ element.description }} </span>
							<span
								class="dayplanner-delete"
								@click="removeFromSelected(index)"
							></span>
						</li>
					</template>
				</draggable>
			</div>
		</div>
	</div>
	<hr />

	<button class="dayplanner-button" @click="generatePdf()">PDF erstellen</button>
</template>

<script>
import draggable from "vuedraggable";
import jsPDF from "jspdf";
import images from "../store/images";

export default {
  name: "DayPlanner",
  components: {
    draggable,
  },
  data() {
    return {
      itemsAvailable: images,
      itemsSelected: [],
    };
  },
  methods: {
    generatePdf: function () {
      const itemIds = this.itemsSelected.map((item) => item.id);
      const filename = `tagesplaner_${itemIds.join('-')}.pdf`
      const doc = new jsPDF();
      doc.setProperties({
        title: 'KiTa Tagesplaner',
        subject: 'KiTa Tagesplaner mit Bildern',
        author: 'Sarah Girlich',
        keywords: 'KiTa,NULLzuEINS,Tagesplaner',
        creator: 'Landeskompetenzzentrum zur Sprachförderungan Kindertageseinrichtungen in Sachsen(LakoS)'
      });

      // Add two images on every page.
      this.itemsSelected.forEach(async (item, index) => {
        let top = 20;
        if (index % 2 !== 0) {
           top = 155
        }
        doc.addImage(
          require(`@/assets/images/${item.filename}`),
          "JPEG",
          15,
          top,
          180,
          120
        );

        if (index % 2 !== 0 && index !== this.itemsSelected.length - 1) {
          doc.addPage();
        }
      });
      // Save the PDF
      doc.save(filename);
      // Return the PDF as a blob
      doc.output("blob");
    },
    persist: function () {
      localStorage.itemsSelected = JSON.stringify(this.itemsSelected);
    },
    removeFromSelected(index) {
      this.itemsSelected.splice(index, 1);
      this.persist();
    },
  },
  mounted() {
    if (window.localStorage.itemsSelected) {
      this.itemsSelected = JSON.parse(window.localStorage.itemsSelected);
    }
  },
};
</script>


<style lang="css" scoped>
	.dayplanner {
		--color-primary: #00bcd4;
		--color-secondary: #ff4081;
		--color-tertiary: #a3204c;
		--color-gray: #f5f5f5;
		--color-gray-light: #eaeaea;
		--color-gray-dark: #9b9b9b;
		--color-gray-light-dark: #737373;
		--color-gray-light-light: #d3d3d3;
		--color-white: #eee;
		--color-error: #f44336;
		--color-warning: #ff9800;
		--font-family: "Roboto", sans-serif;
		--font-size-base: 16px;
		--font-size-sm: 12px;
		--font-size-lg: 20px;
		--font-size-xlg: 24px;
		--font-size-xxlg: 32px;
		--padding-base: 16px;
		--padding-sm: 14px;
		--padding-lg: 16px;
		--padding-xlg: 24px;
		--padding-xxlg: 32px;
		--padding-xxxlg: 48px;
		--border-radius-base: 0.25rem;
	}
	.dayplanner {
		background: #eee;
	}
	.dayplanner-row {
		display: grid;
		grid-auto-flow: column;
		gap: var(--padding-base);
	}
	.dayplanner-col {
		flex: 1;
		height: 100%;
		border: 1px solid var(--color-gray);
	}
	.dayplanner-group {
		border: 1px solid var(--color-gray-light);
		min-height: 100px;
		min-width: 100px;
		background-color: var(--color-gray-light-light);
		padding: var(--padding-base) var(--padding-base) var(--padding-xxxlg);
	}
	.dayplanner-item {
		cursor: draggable;
		padding: 10px;
		border: 1px solid #ccc;
		margin: 5px;
		background-color: #eee;
		position: relative;
	}
	.dayplanner-item--grab {
		cursor: grab;
	}
	.dayplanner-choosen,
	.dayplanner-ghost,
	.dayplanner-item--grab:active {
		cursor: grabbing !important;
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

	.button {
		margin-top: 35px;
	}
	ol {
		list-style: none;
	}
	ol > li,
	ul > li {
		position: relative;
		display: block;
		padding: 0.5rem;
		margin-left: 0.5rem;
		margin-right: 0.5rem;
		border-radius: var(--border-radius-base);
		background-color: #eee;
		border: 1px solid #ccc;
	}
	.dayplanner-handle::before:active {
		cursor: grabbing;
	}
	.dayplanner-handle::before {
		content: "☰";
		position: absolute;
		top: 0;
		left: 0;
		cursor: grab;
		border: var(--color-gray) solid 1px;
		border-radius: var(--border-radius-base) 0 0 var(--border-radius-base);
		background-color: var(--color-gray-light);
		line-height: 2.5em;
		width: 3rem;
	}
	.dayplanner-handle:hover::before {
		background-color: var(--color-gray-light-dark);
		color: var(--color-white);
	}

	.dayplanner-delete::after {
		content: "⌫";
		position: absolute;
		top: 0;
		right: 0;
		padding: var(--padding-md);
		line-height: 2.5rem;
		border: var(--color-gray) solid 1px;
		border-radius: 0 var(--border-radius-base) var(--border-radius-base) 0;
		color: var(--color-error);
		font-weight: 900;
		background-color: #ea333322;
		width: 3rem;
	}
	.dayplanner-delete:hover::after {
		background-color: var(--color-error);
		color: var(--color-white);
		cursor: pointer;
	}

	.dayplanner-text {
		margin: 20px;
	}
	.dayplanner-button {
		background-color: var(--color-primary);
		color: #fff;
		font-size: large;
		font-weight: bold;
		padding: var(--padding-base);
		border-radius: 6px;
		border: var(--color-gray-light) solid 4px;
		margin: var(--padding-base);
		cursor: pointer;
	}
	.dayplanner-button:hover {
		background-color: var(--color-secondary);
	}
	.dayplanner-button:active {
		background-color: var(--color-tertiary);
	}
</style>
