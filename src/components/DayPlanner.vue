<template>
	<h1>KiTa Tagesplaner</h1>
	<p>Erstellen Sie einen Tagesplan für ihren Kindergarten. Schieben Sie dazu alle Tagespunkte von der linken- auf die rechte Seite! Wenn sie fertig sind, drücken Sie auf "PDF erstellen".</p>
	<div class="dayplanner">
		<div class="dayplanner-row">
			<div class="dayplanner-col">
				<p>Verfügbare Tagespunkte</p>
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
							<span class="dayplanner-text">{{ element.description }}</span>
						</li>
					</template>
				</draggable>
			</div>

			<div class="dayplanner-col">
				<p>Ausgewählte Tagespunkte</p>
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

	<button
		class="dayplanner-button"
		@click="generatePdf()"
	>PDF erstellen</button>
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
	.dayplanner,
	.dayplanner-button {
		--color-primary: hsl(10, 100%, 58%);
		--color-secondary: hsl(10, 98%, 38%);
		--color-gray: hsl(0, 0%, 70%);
		--color-gray-light: hsl(0, 0%, 86%);
		--color-gray-light-light: hsl(0, 0%, 90%);
		--color-gray-dark: hsl(215, 26%, 23%);
		--color-gray-dark-dark: hsl(206, 72%, 11%);
		--color-white: hsl(0, 0%, 93%);
		--color-error: hsl(4, 90%, 58%);
		--color-warning: hsl(36, 100%, 50%);
		--font-family: "Roboto", sans-serif;
		--padding-base: 16px;
		--padding-sm: 14px;
		--padding-lg: 16px;
		--padding-xlg: 24px;
		--padding-xxlg: 32px;
		--padding-xxxlg: 48px;
		--border-radius-base: 0.25em;
	}

	@media (prefers-color-scheme: light) {
		.dayplanner,
		.dayplanner-button {
			--color-background: var(--color-gray-light-light);
			--color-background-item: var(--color-gray-light);
			--color-background-item-active: var(--color-gray);
			--color-text: var(--color-gray-dark-dark);
			--color-border: var(--color-gray-light);
		}
	}

	@media (prefers-color-scheme: dark) {
		.dayplanner,
		.dayplanner-button {
			--color-gray: #334756;
			--color-background: var(--color-gray-dark-dark);
			--color-background-item: var(--color-gray-dark);
			--color-background-item-active: var(--color-gray);
			--color-text: var(--color-gray-light);
			--color-border: var(--color-gray-dark-dark);
		}
	}

	.dayplanner {
		background: var(--color-background);
		color: var(--color-text);
	}

	.dayplanner-row {
		display: grid;
		grid-auto-flow: column;
		gap: var(--padding-base);
	}

	.dayplanner-col {
		flex: 1;
		height: 100%;
		border: 1px solid var(--color-border);
	}

	.dayplanner-group {
		border: 1px solid var(--color-background-item-active);
		min-height: 100px;
		min-width: 100px;
		background-color: var(--color-background);
		padding: var(--padding-base) var(--padding-base) var(--padding-xxxlg);
	}

	.dayplanner-item {
		cursor: draggable;
		padding: 10px;
		border: 1px solid var(--color-border);
		margin: 5px;
		background-color: var(--color-background-item);
		position: relative;
	}

	.dayplanner-item--grab {
		cursor: grab;
	}

	.dayplanner-choosen .dayplanner-handle::before {
		background-color: inherit;
		&:active {
			background-color: inherit;
		}
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
		color: var(--color-text);
		position: absolute;
		right: 1rem;
		top: 0;
		bottom: 0;
	}

	.dayplanner-ghost {
		background-color: var(--color-background-item-active);
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
		border: 1px solid var(--color-border);
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
		background-color: var(--color-background-item-active);
		line-height: 3em;
		width: 3em;
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
		line-height: 3em;
		border: var(--color-gray) solid 1px;
		border-radius: 0 var(--border-radius-base) var(--border-radius-base) 0;
		color: var(--color-error);
		font-weight: 900;
		background-color: #ea333322;
		width: 3em;
	}

	.dayplanner-delete:hover::after {
		background-color: var(--color-error);
		color: var(--color-white);
		cursor: pointer;
	}

	.dayplanner-text {
		line-height: 1.9em;
	}

	.dayplanner-button {
		background-color: var(--color-primary);
		color: var(--color-text);
		font-size: large;
		font-weight: bold;
		padding: var(--padding-base);
		border-radius: 6px;
		margin: var(--padding-base);
		border: #33333355 solid 4px;
		cursor: pointer;
	}

	.dayplanner-button:hover {
		background-color: var(--color-secondary);
	}

	.dayplanner-button:active {
		background-color: var(--color-tertiary);
	}

	/* breakpoint for iphone 12 */
	@media screen and (max-width: 576px) {
		.dayplanner {
			font-size: 70%;
		}
		.dayplanner-row {
			gap: 0;
		}
		.dayplanner-group {
			border: none;
			padding: 0;
		}
		.dayplanner-delete::after {
			width: 3em;
		}
		.dayplanner-text {
			line-height: 1.5em;
		}
	}
</style>
