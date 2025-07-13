// Modern Todo Drag & Drop Board
document.addEventListener('DOMContentLoaded', () => {
    let draggedCard = null;

    // Drag & Drop events
    document.querySelectorAll('.card').forEach(card => {
        if (!card.classList.contains('subtask')) {
            makeParentTask(card);
        }
    });

    document.querySelectorAll('.list').forEach(list => {
        list.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        list.addEventListener('dragenter', (e) => {
            e.preventDefault();
            list.classList.add('over');
        });
        list.addEventListener('dragleave', (e) => {
            list.classList.remove('over');
        });
        list.addEventListener('drop', (e) => {
            if (draggedCard) {
                list.appendChild(draggedCard);
            }
            list.classList.remove('over');
        });
    });

    // Add new todo card
    const todoForm = document.createElement('form');
    todoForm.id = 'todo-form';
    todoForm.innerHTML = `
        <input type="text" id="todo-input" placeholder="Add a new task..." required />
        <button type="submit">Add</button>
    `;
    document.querySelector('.container').insertBefore(todoForm, document.querySelector('.board'));

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('todo-input');
        const value = input.value.trim();
        if (value) {
            const card = document.createElement('div');
            card.className = 'card';
            card.setAttribute('draggable', 'true');
            card.textContent = value;
            makeParentTask(card);
            document.getElementById('list1').appendChild(card);
            input.value = '';
        }
    });

    // Make a card a parent task with subtasks support
    function makeParentTask(card) {
        card.classList.remove('subtask');
        // Save the label before clearing
        let labelText = card.querySelector('.task-label')?.textContent || card.textContent || card.id || '';
        card.innerHTML = '';
        // Card header (label + controls)
        const header = document.createElement('div');
        header.className = 'card-header';
        // Task label
        const label = document.createElement('span');
        label.className = 'task-label';
        label.textContent = labelText;
        header.appendChild(label);

        // Expand/collapse button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'toggle-btn';
        toggleBtn.title = 'Show/Hide subtasks';
        toggleBtn.innerHTML = '▸';
        header.appendChild(toggleBtn);

        // Add subtask button
        const addSubBtn = document.createElement('button');
        addSubBtn.className = 'add-subtask-btn';
        addSubBtn.title = 'Add subtask';
        addSubBtn.textContent = '+';
        header.appendChild(addSubBtn);

        // Delete button
        addDeleteButton(header);

        card.appendChild(header);

        // Subtasks container (always below header)
        let subtasks = card.querySelector('.subtasks');
        if (!subtasks) {
            subtasks = document.createElement('div');
            subtasks.className = 'subtasks';
            subtasks.style.display = 'none';
            card.appendChild(subtasks);
        } else {
            card.appendChild(subtasks); // move to end
        }

        // Drag events
        addCardEvents(card);

        // Toggle subtasks
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (subtasks.style.display === 'none') {
                subtasks.style.display = 'block';
                toggleBtn.innerHTML = '▼';
            } else {
                subtasks.style.display = 'none';
                toggleBtn.innerHTML = '▸';
            }
        });

        // Add subtask
        addSubBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const subtaskText = prompt('Enter subtask:');
            if (subtaskText && subtaskText.trim()) {
                const sub = document.createElement('div');
                sub.className = 'card subtask';
                sub.textContent = subtaskText.trim();
                // Assign a random pastel background color and border
                const hue = Math.floor(Math.random() * 360);
                sub.style.background = `hsl(${hue}, 70%, 90%)`;
                sub.style.borderLeft = `4px solid hsl(${hue}, 70%, 60%)`;
                addCardEvents(sub);
                addDeleteButton(sub);
                subtasks.appendChild(sub);
                subtasks.style.display = 'block';
                toggleBtn.innerHTML = '▼';
            }
        });
    }

    // Drag events for both parent and subtask
    function addCardEvents(card) {
        card.addEventListener('dragstart', (e) => {
            draggedCard = card;
            setTimeout(() => card.classList.add('hide'), 0);
        });
        card.addEventListener('dragend', (e) => {
            card.classList.remove('hide');
            draggedCard = null;
        });
    }

    // X delete button for any card
    function addDeleteButton(card) {
        const oldBtn = card.querySelector('.delete-btn');
        if (oldBtn) oldBtn.remove();
        const btn = document.createElement('button');
        btn.className = 'delete-btn';
        btn.textContent = '×';
        btn.title = 'Delete task';
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            card.remove();
        });
        card.appendChild(btn);
    }
});