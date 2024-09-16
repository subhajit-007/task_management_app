const draggables = document.querySelectorAll('.draggable');
const statusContainers = document.querySelectorAll('.container');
let draggedElement = null;

// Handle desktop drag events
draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging');
        draggedElement = draggable;
    });

    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging');
        const newContainer = draggable.closest('.container');
        const newStatus = newContainer.getAttribute('data-status');
        updateTaskStatus(draggable, newStatus);
    });
});

// Handle mobile touch events
draggables.forEach(draggable => {
    draggable.addEventListener('touchstart', (e) => {
        e.preventDefault();
        draggedElement = draggable;
        draggable.classList.add('dragging');
    });

    draggable.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touchLocation = e.targetTouches[0];
        draggable.style.position = 'absolute';
        draggable.style.left = `${touchLocation.pageX - draggable.offsetWidth / 2}px`;
        draggable.style.top = `${touchLocation.pageY - draggable.offsetHeight / 2}px`;
    });

    draggable.addEventListener('touchend', (e) => {
        e.preventDefault();
        draggable.classList.remove('dragging');
        draggable.style.position = '';
        draggable.style.left = '';
        draggable.style.top = '';

        const newContainer = getTouchedContainer(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        if (newContainer) {
            newContainer.appendChild(draggedElement);
            const newStatus = newContainer.getAttribute('data-status');
            updateTaskStatus(draggedElement, newStatus);
        }
        draggedElement = null;
    });
});

// Get container based on touch location
function getTouchedContainer(x, y) {
    return [...statusContainers].find(container => {
        const rect = container.getBoundingClientRect();
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    });
}

// Update the task status text
function updateTaskStatus(task, status) {
    const statusButton = task.querySelector('.btn');
    statusButton.textContent = status; // Update button text to new status
}

statusContainers.forEach(container => {
    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        const draggable = document.querySelector('.dragging');
        if (afterElement == null) {
            container.appendChild(draggable);
        } else {
            container.insertBefore(draggable, afterElement);
        }
    });
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
