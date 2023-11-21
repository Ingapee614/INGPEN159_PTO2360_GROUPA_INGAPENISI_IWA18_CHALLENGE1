import { updateDraggingHtml,html,createOrderHtml,moveToColumn} from './view.js';
import {  updateDragging,createOrderData,COLUMNS } from './data.js'


/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging 
 * over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event 
 */
 

//dragover
let dragId=null;

const handleDragOver = (event) => {
    event.preventDefault();
    const path = event.path || event.composedPath()
    let column = null

    for (const element of path) {
        const { area } = element.dataset
        if (area) {
            column = area
            break;
        }
    }

    if (!column) return
    updateDragging({ over: column })
    updateDraggingHtml({ over: column })
}
  const handleDragStart = (event) => {
 dragId = event.target.dataset.id;
event.dataTransfer.setData(null, dragId);
  };
  
  const handleDragEnd = (event) => {
 let column = null;
  const data = event.dataTransfer.getData(null);
    for (const columnName of COLUMNS) {
      if (html.area[columnName].style.backgroundColor === "rgba(0, 160, 70, 0.2)")
      column = html.area[columnName] .querySelector('[class="grid__content"]').getAttribute("data-column");
        html.area[columnName].style.backgroundColor =null;
    }
    moveToColumn(dragId, column);
  };
  ;





//helpButton

const overlay=html.help.overlay; 
    const helpCancel=html.help.cancel
const handleHelpToggle = (event) => {
 overlay.style.display="block";
if(event.target==helpCancel)
   overlay.style.display="none";
   }

//add order button

   const overlayAdd=html.add.overlay;
   const AddCancel=html.add.cancel;
   const formData=html.add.form;
   const addOrder=html.other.add;

   const handleAddToggle = (event) => {
   if(event.target===AddCancel){
   overlayAdd.style.display="none";
   formData.reset();
   focus();
}
   else if(event.target===addOrder){
    overlayAdd.style.display= "block";
   }}

//Addsubmit
const handleAddSubmit = (event) => {      
            event.preventDefault();
            const title = html.add.title.value;
            const table = html.add.table.value;
            const newOrder = createOrderData({ title, table, column: "ordered" });
            const newOrderHtml = createOrderHtml(newOrder);
            const orderedColumn = html.columns.ordered;
            orderedColumn.appendChild(newOrderHtml);
            formData.reset();
            overlayAdd.style.display="none";
            
        }

        //edit order
       
    const editOverlay = html.edit.overlay;
    let orderId = "";
    const updateEditButton = html.edit.form;
    const deleteEditButton = html.edit.delete;
    const cancelEditButton =  html.edit.cancel;
    const formEdit = html.edit.form;
   

    const handleEditToggle = (event) => {
    
        const Order = event.target.closest(".order");
        orderId = event.target.dataset.id;
        
        if (Order) {
          editOverlay.style.display="block";
        } else if ( event.target ===cancelEditButton) {
          editOverlay.style.display="none"
          formEdit.reset();
          
        }
      };
      
      const handleDelete = (event) => {
        const orderHtml = document.querySelector(`[data-id="${orderId}"]`);
        if (event.target === deleteEditButton) {
          orderHtml.remove();
          editOverlay.style.display="none";
          
        }
      };
      
      
      const handleEditSubmit = (event) => {
        event.preventDefault();
        const editTitle = html.edit.title.value;
        const editTable = html.edit.table.value;
        const editStatus = html.edit.column.value;
        const orderHtml = document.querySelector(`[data-id="${orderId}"]`);

        if (event.target ===updateEditButton) {
          orderHtml.querySelector("[data-order-title]").textContent = editTitle;
          orderHtml.querySelector("[data-order-table]").textContent = editTable;
          moveToColumn(orderId, editStatus);
          updateEditButton.reset();
          editOverlay.style.display='none';
          focus();
        }
      };

  
      





    
html.add.cancel.addEventListener('click', handleAddToggle)
html.other.add.addEventListener('click', handleAddToggle)
html.add.form.addEventListener('submit', handleAddSubmit)


html.other.grid.addEventListener('click', handleEditToggle)
html.edit.cancel.addEventListener('click', handleEditToggle)
html.edit.form.addEventListener('submit', handleEditSubmit)
html.edit.delete.addEventListener('click', handleDelete)

html.other.help.addEventListener('focus', handleHelpToggle);
html.help.cancel.addEventListener('click', handleHelpToggle)



for (const htmlColumn of Object.values(html.columns)) {
    htmlColumn.addEventListener('dragstart', handleDragStart)
    htmlColumn.addEventListener('dragend', handleDragEnd)
}

for (const htmlArea of Object.values(html.area)) {
    htmlArea.addEventListener('dragover', handleDragOver)}

