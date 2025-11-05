// Fiction Writing Machine - Main Application

class FictionApp {
    constructor() {
        this.data = {
            projects: [],
            currentProjectId: null,
            githubToken: null,
            githubRepo: null
        };

        this.init();
    }

    init() {
        this.loadFromLocalStorage();
        this.setupEventListeners();
        this.render();
    }

    // ==================== DATA MANAGEMENT ====================

    loadFromLocalStorage() {
        const saved = localStorage.getItem('fictionWritingMachine');
        if (saved) {
            try {
                this.data = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to load data:', e);
            }
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('fictionWritingMachine', JSON.stringify(this.data));
    }

    getCurrentProject() {
        return this.data.projects.find(p => p.id === this.data.currentProjectId);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // ==================== PROJECT MANAGEMENT ====================

    createProject(projectData) {
        const project = {
            id: this.generateId(),
            title: projectData.title,
            genre: projectData.genre || '',
            status: projectData.status || 'planning',
            characters: [],
            locations: [],
            scenes: [],
            createdAt: new Date().toISOString()
        };

        this.data.projects.push(project);
        this.data.currentProjectId = project.id;
        this.saveToLocalStorage();
        this.render();
        this.showMessage('Project created');
    }

    updateProject(projectId, updates) {
        const project = this.data.projects.find(p => p.id === projectId);
        if (project) {
            Object.assign(project, updates);
            this.saveToLocalStorage();
            this.render();
            this.showMessage('Project updated');
        }
    }

    deleteProject(projectId) {
        if (confirm('Delete this project? This cannot be undone.')) {
            this.data.projects = this.data.projects.filter(p => p.id !== projectId);
            if (this.data.currentProjectId === projectId) {
                this.data.currentProjectId = this.data.projects[0]?.id || null;
            }
            this.saveToLocalStorage();
            this.render();
            this.showMessage('Project deleted');
        }
    }

    selectProject(projectId) {
        this.data.currentProjectId = projectId;
        this.saveToLocalStorage();
        this.render();
    }

    // ==================== CHARACTER MANAGEMENT ====================

    createCharacter(characterData) {
        const project = this.getCurrentProject();
        if (!project) {
            this.showMessage('Please create a project first', 'error');
            return;
        }

        const character = {
            id: this.generateId(),
            name: characterData.name,
            physicalFacts: characterData.physicalFacts || '',
            role: characterData.role || '',
            createdAt: new Date().toISOString()
        };

        project.characters.push(character);
        this.saveToLocalStorage();
        this.render();
        this.showMessage('Character added');
    }

    updateCharacter(characterId, updates) {
        const project = this.getCurrentProject();
        if (!project) return;

        const character = project.characters.find(c => c.id === characterId);
        if (character) {
            Object.assign(character, updates);
            this.saveToLocalStorage();
            this.render();
            this.showMessage('Character updated');
        }
    }

    deleteCharacter(characterId) {
        if (confirm('Delete this character?')) {
            const project = this.getCurrentProject();
            if (!project) return;

            project.characters = project.characters.filter(c => c.id !== characterId);
            this.saveToLocalStorage();
            this.render();
            this.showMessage('Character deleted');
        }
    }

    // ==================== LOCATION MANAGEMENT ====================

    createLocation(locationData) {
        const project = this.getCurrentProject();
        if (!project) {
            this.showMessage('Please create a project first', 'error');
            return;
        }

        const location = {
            id: this.generateId(),
            name: locationData.name,
            description: locationData.description || '',
            createdAt: new Date().toISOString()
        };

        project.locations.push(location);
        this.saveToLocalStorage();
        this.render();
        this.showMessage('Location added');
    }

    updateLocation(locationId, updates) {
        const project = this.getCurrentProject();
        if (!project) return;

        const location = project.locations.find(l => l.id === locationId);
        if (location) {
            Object.assign(location, updates);
            this.saveToLocalStorage();
            this.render();
            this.showMessage('Location updated');
        }
    }

    deleteLocation(locationId) {
        if (confirm('Delete this location?')) {
            const project = this.getCurrentProject();
            if (!project) return;

            project.locations = project.locations.filter(l => l.id !== locationId);
            this.saveToLocalStorage();
            this.render();
            this.showMessage('Location deleted');
        }
    }

    // ==================== SCENE MANAGEMENT ====================

    createScene(sceneData) {
        const project = this.getCurrentProject();
        if (!project) {
            this.showMessage('Please create a project first', 'error');
            return;
        }

        const scene = {
            id: this.generateId(),
            number: project.scenes.length + 1,
            beats: sceneData.beats || '',
            characters: sceneData.characters || [],
            locations: sceneData.locations || [],
            createdAt: new Date().toISOString()
        };

        project.scenes.push(scene);
        this.saveToLocalStorage();
        this.render();
        this.showMessage('Scene added');
    }

    updateScene(sceneId, updates) {
        const project = this.getCurrentProject();
        if (!project) return;

        const scene = project.scenes.find(s => s.id === sceneId);
        if (scene) {
            Object.assign(scene, updates);
            this.saveToLocalStorage();
            this.render();
            this.showMessage('Scene updated');
        }
    }

    deleteScene(sceneId) {
        if (confirm('Delete this scene?')) {
            const project = this.getCurrentProject();
            if (!project) return;

            project.scenes = project.scenes.filter(s => s.id !== sceneId);
            // Renumber remaining scenes
            project.scenes.forEach((scene, index) => {
                scene.number = index + 1;
            });
            this.saveToLocalStorage();
            this.render();
            this.showMessage('Scene deleted');
        }
    }

    // ==================== UI RENDERING ====================

    render() {
        this.renderCurrentProject();
        this.renderProjects();
        this.renderCharacters();
        this.renderLocations();
        this.renderScenes();
    }

    renderCurrentProject() {
        const project = this.getCurrentProject();
        const display = document.getElementById('current-project-name');
        if (project) {
            display.textContent = project.title;
        } else {
            display.textContent = 'No project selected';
        }
    }

    renderProjects() {
        const container = document.getElementById('projects-list');

        if (this.data.projects.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No projects yet</p>
                    <p>Create your first novel project to get started</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.data.projects.map(project => `
            <div class="card ${project.id === this.data.currentProjectId ? 'active' : ''}" data-project-id="${project.id}">
                <h3>${this.escapeHtml(project.title)}</h3>
                <div class="meta">
                    ${project.genre ? `Genre: ${this.escapeHtml(project.genre)} • ` : ''}
                    Status: ${this.escapeHtml(project.status)}
                </div>
                <div class="meta">
                    ${project.characters.length} characters •
                    ${project.locations.length} locations •
                    ${project.scenes.length} scenes
                </div>
                <div class="card-actions">
                    <button class="btn-secondary btn-select-project" data-project-id="${project.id}">Select</button>
                    <button class="btn-secondary btn-edit-project" data-project-id="${project.id}">Edit</button>
                    <button class="btn-danger btn-delete-project" data-project-id="${project.id}">Delete</button>
                </div>
            </div>
        `).join('');

        // Add event listeners for project action buttons
        container.querySelectorAll('.btn-select-project').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectProject(e.target.dataset.projectId);
            });
        });

        container.querySelectorAll('.btn-edit-project').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showEditProjectForm(e.target.dataset.projectId);
            });
        });

        container.querySelectorAll('.btn-delete-project').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteProject(e.target.dataset.projectId);
            });
        });
    }

    renderCharacters() {
        const container = document.getElementById('characters-list');
        const project = this.getCurrentProject();

        if (!project) {
            container.innerHTML = '<div class="no-project-warning">Select a project first</div>';
            return;
        }

        if (project.characters.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No characters yet</p>
                </div>
            `;
            return;
        }

        container.innerHTML = project.characters.map(character => `
            <div class="card">
                <h3>${this.escapeHtml(character.name)}</h3>
                ${character.role ? `<div class="meta">Role: ${this.escapeHtml(character.role)}</div>` : ''}
                ${character.physicalFacts ? `<div class="description">${this.escapeHtml(character.physicalFacts)}</div>` : ''}
                <div class="card-actions">
                    <button class="btn-secondary btn-edit-character" data-character-id="${character.id}">Edit</button>
                    <button class="btn-danger btn-delete-character" data-character-id="${character.id}">Delete</button>
                </div>
            </div>
        `).join('');

        // Add event listeners for character action buttons
        container.querySelectorAll('.btn-edit-character').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showEditCharacterForm(e.target.dataset.characterId);
            });
        });

        container.querySelectorAll('.btn-delete-character').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteCharacter(e.target.dataset.characterId);
            });
        });
    }

    renderLocations() {
        const container = document.getElementById('locations-list');
        const project = this.getCurrentProject();

        if (!project) {
            container.innerHTML = '<div class="no-project-warning">Select a project first</div>';
            return;
        }

        if (project.locations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No locations yet</p>
                </div>
            `;
            return;
        }

        container.innerHTML = project.locations.map(location => `
            <div class="card">
                <h3>${this.escapeHtml(location.name)}</h3>
                ${location.description ? `<div class="description">${this.escapeHtml(location.description)}</div>` : ''}
                <div class="card-actions">
                    <button class="btn-secondary btn-edit-location" data-location-id="${location.id}">Edit</button>
                    <button class="btn-danger btn-delete-location" data-location-id="${location.id}">Delete</button>
                </div>
            </div>
        `).join('');

        // Add event listeners for location action buttons
        container.querySelectorAll('.btn-edit-location').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showEditLocationForm(e.target.dataset.locationId);
            });
        });

        container.querySelectorAll('.btn-delete-location').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteLocation(e.target.dataset.locationId);
            });
        });
    }

    renderScenes() {
        const container = document.getElementById('scenes-list');
        const project = this.getCurrentProject();

        if (!project) {
            container.innerHTML = '<div class="no-project-warning">Select a project first</div>';
            return;
        }

        if (project.scenes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No scenes yet</p>
                </div>
            `;
            return;
        }

        container.innerHTML = project.scenes.map(scene => {
            const characterNames = scene.characters
                .map(id => project.characters.find(c => c.id === id)?.name)
                .filter(Boolean)
                .join(', ');

            const locationNames = scene.locations
                .map(id => project.locations.find(l => l.id === id)?.name)
                .filter(Boolean)
                .join(', ');

            return `
                <div class="scene-item">
                    <div class="scene-header">
                        <div class="scene-number">Scene ${scene.number}</div>
                        <div>
                            <button class="btn-secondary btn-edit-scene" data-scene-id="${scene.id}">Edit</button>
                            <button class="btn-danger btn-delete-scene" data-scene-id="${scene.id}">Delete</button>
                        </div>
                    </div>
                    <div class="scene-beats">${this.escapeHtml(scene.beats)}</div>
                    ${characterNames || locationNames ? `
                        <div class="scene-references">
                            ${characterNames ? `Characters: ${this.escapeHtml(characterNames)}` : ''}
                            ${characterNames && locationNames ? ' • ' : ''}
                            ${locationNames ? `Location: ${this.escapeHtml(locationNames)}` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');

        // Add event listeners for scene action buttons
        container.querySelectorAll('.btn-edit-scene').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showEditSceneForm(e.target.dataset.sceneId);
            });
        });

        container.querySelectorAll('.btn-delete-scene').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteScene(e.target.dataset.sceneId);
            });
        });
    }

    // ==================== MODAL FORMS ====================

    showModal(title, content) {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modal-body');

        modalBody.innerHTML = `
            <h2>${title}</h2>
            ${content}
        `;

        modal.classList.add('active');
    }

    hideModal() {
        document.getElementById('modal').classList.remove('active');
    }

    showNewProjectForm() {
        this.showModal('New Project', `
            <form id="project-form">
                <div class="form-group">
                    <label for="project-title">Title *</label>
                    <input type="text" id="project-title" required>
                </div>
                <div class="form-group">
                    <label for="project-genre">Genre Tags</label>
                    <input type="text" id="project-genre" placeholder="e.g. Fantasy, Mystery">
                </div>
                <div class="form-group">
                    <label for="project-status">Status</label>
                    <select id="project-status">
                        <option value="planning">Planning</option>
                        <option value="drafting">Drafting</option>
                        <option value="revising">Revising</option>
                        <option value="complete">Complete</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="app.hideModal()">Cancel</button>
                    <button type="submit" class="btn-primary">Create Project</button>
                </div>
            </form>
        `);

        document.getElementById('project-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createProject({
                title: document.getElementById('project-title').value,
                genre: document.getElementById('project-genre').value,
                status: document.getElementById('project-status').value
            });
            this.hideModal();
        });
    }

    showEditProjectForm(projectId) {
        const project = this.data.projects.find(p => p.id === projectId);
        if (!project) return;

        this.showModal('Edit Project', `
            <form id="project-form">
                <div class="form-group">
                    <label for="project-title">Title *</label>
                    <input type="text" id="project-title" value="${this.escapeHtml(project.title)}" required>
                </div>
                <div class="form-group">
                    <label for="project-genre">Genre Tags</label>
                    <input type="text" id="project-genre" value="${this.escapeHtml(project.genre || '')}">
                </div>
                <div class="form-group">
                    <label for="project-status">Status</label>
                    <select id="project-status">
                        <option value="planning" ${project.status === 'planning' ? 'selected' : ''}>Planning</option>
                        <option value="drafting" ${project.status === 'drafting' ? 'selected' : ''}>Drafting</option>
                        <option value="revising" ${project.status === 'revising' ? 'selected' : ''}>Revising</option>
                        <option value="complete" ${project.status === 'complete' ? 'selected' : ''}>Complete</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="app.hideModal()">Cancel</button>
                    <button type="submit" class="btn-primary">Save Changes</button>
                </div>
            </form>
        `);

        document.getElementById('project-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProject(projectId, {
                title: document.getElementById('project-title').value,
                genre: document.getElementById('project-genre').value,
                status: document.getElementById('project-status').value
            });
            this.hideModal();
        });
    }

    showNewCharacterForm() {
        const project = this.getCurrentProject();
        if (!project) {
            this.showMessage('Please create a project first', 'error');
            return;
        }

        this.showModal('New Character', `
            <form id="character-form">
                <div class="form-group">
                    <label for="character-name">Name *</label>
                    <input type="text" id="character-name" required>
                </div>
                <div class="form-group">
                    <label for="character-role">Role</label>
                    <input type="text" id="character-role" placeholder="e.g. Protagonist, Antagonist">
                </div>
                <div class="form-group">
                    <label for="character-physical">Physical Facts</label>
                    <textarea id="character-physical" placeholder="Physical description only - no emotions or psychology"></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="app.hideModal()">Cancel</button>
                    <button type="submit" class="btn-primary">Add Character</button>
                </div>
            </form>
        `);

        document.getElementById('character-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createCharacter({
                name: document.getElementById('character-name').value,
                role: document.getElementById('character-role').value,
                physicalFacts: document.getElementById('character-physical').value
            });
            this.hideModal();
        });
    }

    showEditCharacterForm(characterId) {
        const project = this.getCurrentProject();
        if (!project) return;

        const character = project.characters.find(c => c.id === characterId);
        if (!character) return;

        this.showModal('Edit Character', `
            <form id="character-form">
                <div class="form-group">
                    <label for="character-name">Name *</label>
                    <input type="text" id="character-name" value="${this.escapeHtml(character.name)}" required>
                </div>
                <div class="form-group">
                    <label for="character-role">Role</label>
                    <input type="text" id="character-role" value="${this.escapeHtml(character.role || '')}">
                </div>
                <div class="form-group">
                    <label for="character-physical">Physical Facts</label>
                    <textarea id="character-physical">${this.escapeHtml(character.physicalFacts || '')}</textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="app.hideModal()">Cancel</button>
                    <button type="submit" class="btn-primary">Save Changes</button>
                </div>
            </form>
        `);

        document.getElementById('character-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateCharacter(characterId, {
                name: document.getElementById('character-name').value,
                role: document.getElementById('character-role').value,
                physicalFacts: document.getElementById('character-physical').value
            });
            this.hideModal();
        });
    }

    showNewLocationForm() {
        const project = this.getCurrentProject();
        if (!project) {
            this.showMessage('Please create a project first', 'error');
            return;
        }

        this.showModal('New Location', `
            <form id="location-form">
                <div class="form-group">
                    <label for="location-name">Name *</label>
                    <input type="text" id="location-name" required>
                </div>
                <div class="form-group">
                    <label for="location-description">Description</label>
                    <textarea id="location-description" placeholder="Factual description only - what you can see, hear, smell"></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="app.hideModal()">Cancel</button>
                    <button type="submit" class="btn-primary">Add Location</button>
                </div>
            </form>
        `);

        document.getElementById('location-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createLocation({
                name: document.getElementById('location-name').value,
                description: document.getElementById('location-description').value
            });
            this.hideModal();
        });
    }

    showEditLocationForm(locationId) {
        const project = this.getCurrentProject();
        if (!project) return;

        const location = project.locations.find(l => l.id === locationId);
        if (!location) return;

        this.showModal('Edit Location', `
            <form id="location-form">
                <div class="form-group">
                    <label for="location-name">Name *</label>
                    <input type="text" id="location-name" value="${this.escapeHtml(location.name)}" required>
                </div>
                <div class="form-group">
                    <label for="location-description">Description</label>
                    <textarea id="location-description">${this.escapeHtml(location.description || '')}</textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="app.hideModal()">Cancel</button>
                    <button type="submit" class="btn-primary">Save Changes</button>
                </div>
            </form>
        `);

        document.getElementById('location-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateLocation(locationId, {
                name: document.getElementById('location-name').value,
                description: document.getElementById('location-description').value
            });
            this.hideModal();
        });
    }

    showNewSceneForm() {
        const project = this.getCurrentProject();
        if (!project) {
            this.showMessage('Please create a project first', 'error');
            return;
        }

        const characterOptions = project.characters.map(c =>
            `<option value="${c.id}">${this.escapeHtml(c.name)}</option>`
        ).join('');

        const locationOptions = project.locations.map(l =>
            `<option value="${l.id}">${this.escapeHtml(l.name)}</option>`
        ).join('');

        this.showModal('New Scene', `
            <form id="scene-form">
                <div class="form-group">
                    <label for="scene-beats">Scene Beats *</label>
                    <textarea id="scene-beats" required placeholder="What happens in this scene - beats only, not prose"></textarea>
                </div>
                ${project.characters.length > 0 ? `
                    <div class="form-group">
                        <label for="scene-characters">Characters</label>
                        <select id="scene-characters" multiple size="4">
                            ${characterOptions}
                        </select>
                        <small>Hold Ctrl/Cmd to select multiple</small>
                    </div>
                ` : ''}
                ${project.locations.length > 0 ? `
                    <div class="form-group">
                        <label for="scene-locations">Locations</label>
                        <select id="scene-locations" multiple size="4">
                            ${locationOptions}
                        </select>
                        <small>Hold Ctrl/Cmd to select multiple</small>
                    </div>
                ` : ''}
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="app.hideModal()">Cancel</button>
                    <button type="submit" class="btn-primary">Add Scene</button>
                </div>
            </form>
        `);

        document.getElementById('scene-form').addEventListener('submit', (e) => {
            e.preventDefault();

            const characterSelect = document.getElementById('scene-characters');
            const locationSelect = document.getElementById('scene-locations');

            const characters = characterSelect ?
                Array.from(characterSelect.selectedOptions).map(opt => opt.value) : [];
            const locations = locationSelect ?
                Array.from(locationSelect.selectedOptions).map(opt => opt.value) : [];

            this.createScene({
                beats: document.getElementById('scene-beats').value,
                characters,
                locations
            });
            this.hideModal();
        });
    }

    showEditSceneForm(sceneId) {
        const project = this.getCurrentProject();
        if (!project) return;

        const scene = project.scenes.find(s => s.id === sceneId);
        if (!scene) return;

        const characterOptions = project.characters.map(c =>
            `<option value="${c.id}" ${scene.characters.includes(c.id) ? 'selected' : ''}>${this.escapeHtml(c.name)}</option>`
        ).join('');

        const locationOptions = project.locations.map(l =>
            `<option value="${l.id}" ${scene.locations.includes(l.id) ? 'selected' : ''}>${this.escapeHtml(l.name)}</option>`
        ).join('');

        this.showModal('Edit Scene', `
            <form id="scene-form">
                <div class="form-group">
                    <label for="scene-beats">Scene Beats *</label>
                    <textarea id="scene-beats" required>${this.escapeHtml(scene.beats)}</textarea>
                </div>
                ${project.characters.length > 0 ? `
                    <div class="form-group">
                        <label for="scene-characters">Characters</label>
                        <select id="scene-characters" multiple size="4">
                            ${characterOptions}
                        </select>
                    </div>
                ` : ''}
                ${project.locations.length > 0 ? `
                    <div class="form-group">
                        <label for="scene-locations">Locations</label>
                        <select id="scene-locations" multiple size="4">
                            ${locationOptions}
                        </select>
                    </div>
                ` : ''}
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="app.hideModal()">Cancel</button>
                    <button type="submit" class="btn-primary">Save Changes</button>
                </div>
            </form>
        `);

        document.getElementById('scene-form').addEventListener('submit', (e) => {
            e.preventDefault();

            const characterSelect = document.getElementById('scene-characters');
            const locationSelect = document.getElementById('scene-locations');

            const characters = characterSelect ?
                Array.from(characterSelect.selectedOptions).map(opt => opt.value) : [];
            const locations = locationSelect ?
                Array.from(locationSelect.selectedOptions).map(opt => opt.value) : [];

            this.updateScene(sceneId, {
                beats: document.getElementById('scene-beats').value,
                characters,
                locations
            });
            this.hideModal();
        });
    }

    showGitHubSettings() {
        this.showModal('GitHub Settings', `
            <form id="github-settings-form">
                <div class="form-group">
                    <label for="github-token">Personal Access Token</label>
                    <input type="password" id="github-token" value="${this.data.githubToken || ''}"
                           placeholder="ghp_...">
                    <small>Create at: github.com/settings/tokens (needs 'repo' scope)</small>
                </div>
                <div class="form-group">
                    <label for="github-repo">Repository</label>
                    <input type="text" id="github-repo" value="${this.data.githubRepo || ''}"
                           placeholder="username/repo-name">
                    <small>Format: username/repository</small>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="app.hideModal()">Cancel</button>
                    <button type="submit" class="btn-primary">Save Settings</button>
                </div>
            </form>
        `);

        document.getElementById('github-settings-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.data.githubToken = document.getElementById('github-token').value;
            this.data.githubRepo = document.getElementById('github-repo').value;
            this.saveToLocalStorage();
            this.hideModal();
            this.showMessage('GitHub settings saved');
        });
    }

    // ==================== GITHUB INTEGRATION ====================

    async saveToGitHub() {
        if (!this.data.githubToken || !this.data.githubRepo) {
            this.showMessage('Please configure GitHub settings first', 'error');
            this.showGitHubSettings();
            return;
        }

        try {
            const content = btoa(JSON.stringify(this.data, null, 2));
            const [owner, repo] = this.data.githubRepo.split('/');
            const path = 'fiction-data.json';

            // Check if file exists
            let sha = null;
            try {
                const checkResponse = await fetch(
                    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
                    {
                        headers: {
                            'Authorization': `token ${this.data.githubToken}`,
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    }
                );
                if (checkResponse.ok) {
                    const data = await checkResponse.json();
                    sha = data.sha;
                }
            } catch (e) {
                // File doesn't exist, will create new
            }

            // Create or update file
            const response = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${this.data.githubToken}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: `Update fiction data - ${new Date().toISOString()}`,
                        content: content,
                        sha: sha
                    })
                }
            );

            if (response.ok) {
                this.showMessage('Saved to GitHub');
            } else {
                throw new Error('GitHub save failed');
            }
        } catch (error) {
            console.error('GitHub save error:', error);
            this.showMessage('Failed to save to GitHub', 'error');
        }
    }

    async loadFromGitHub() {
        if (!this.data.githubToken || !this.data.githubRepo) {
            this.showMessage('Please configure GitHub settings first', 'error');
            this.showGitHubSettings();
            return;
        }

        try {
            const [owner, repo] = this.data.githubRepo.split('/');
            const path = 'fiction-data.json';

            const response = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
                {
                    headers: {
                        'Authorization': `token ${this.data.githubToken}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                const content = JSON.parse(atob(data.content));

                if (confirm('This will replace all local data. Continue?')) {
                    this.data = content;
                    this.saveToLocalStorage();
                    this.render();
                    this.showMessage('Loaded from GitHub');
                }
            } else {
                throw new Error('GitHub load failed');
            }
        } catch (error) {
            console.error('GitHub load error:', error);
            this.showMessage('Failed to load from GitHub', 'error');
        }
    }

    // ==================== EVENT LISTENERS ====================

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                this.switchView(view);
            });
        });

        // New item buttons
        document.getElementById('new-project-btn').addEventListener('click', () => {
            this.showNewProjectForm();
        });

        document.getElementById('new-character-btn').addEventListener('click', () => {
            this.showNewCharacterForm();
        });

        document.getElementById('new-location-btn').addEventListener('click', () => {
            this.showNewLocationForm();
        });

        document.getElementById('new-scene-btn').addEventListener('click', () => {
            this.showNewSceneForm();
        });

        // GitHub buttons
        document.getElementById('github-save-btn').addEventListener('click', () => {
            this.saveToGitHub();
        });

        document.getElementById('github-load-btn').addEventListener('click', () => {
            this.loadFromGitHub();
        });

        document.getElementById('github-settings-btn').addEventListener('click', () => {
            this.showGitHubSettings();
        });

        // Modal close
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.hideModal();
        });

        document.getElementById('modal').addEventListener('click', (e) => {
            if (e.target.id === 'modal') {
                this.hideModal();
            }
        });
    }

    switchView(viewName) {
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === viewName) {
                btn.classList.add('active');
            }
        });

        // Update views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`${viewName}-view`).classList.add('active');
    }

    // ==================== UTILITIES ====================

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showMessage(message, type = 'success') {
        const messageEl = document.createElement('div');
        messageEl.className = `status-message ${type === 'error' ? 'error' : ''}`;
        messageEl.textContent = message;
        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }
}

// Initialize app
const app = new FictionApp();
