/**
 * GitHub Projects Integration for Portfolio
 * Fetches GitHub repositories and generates project cards dynamically
 */

// Configuration
const GITHUB_USERNAME = 'NishanBhattarai327';
const MAX_PROJECTS = 60;  // Maximum number of projects to display in total
const INITIAL_PROJECTS = 5;  // Initial number of projects to display
const PROJECTS_PER_LOAD = 10;  // Number of projects to load with each "See More" click

// Keep track of loaded projects
let loadedProjects = 0;
let allRepos = [];

/**
 * Fetches repositories from GitHub API
 */
async function fetchGitHubRepos() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc`);
        
        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching GitHub repositories:', error);
        return [];
    }
}

/**
 * Creates a project card from repository data
 */
function createProjectCard(repo) {
    // Extract repository information
    const name = repo.name;
    const description = repo.description || 'No description available';
    const language = repo.language;
    const repoUrl = repo.html_url;
    
    // Determine if the repo has a live demo
    let liveUrl = null;
    // Check if it's a GitHub Pages site
    if (repo.has_pages) {
        liveUrl = `https://${GITHUB_USERNAME}.github.io/${repo.name}`;
    }
    // Check if homepage is set
    if (repo.homepage) {
        liveUrl = repo.homepage;
    }
    
    // Create card HTML
    const card = document.createElement('div');
    card.className = 'project-card';
    
    // Repository name as title
    const title = document.createElement('h3');
    title.textContent = formatRepoName(name);
    
    // Description
    const desc = document.createElement('p');
    desc.textContent = description;
    
    // Technology tags
    const techDiv = document.createElement('div');
    techDiv.className = 'project-tech';
    
    // Add main language if available
    if (language) {
        const langSpan = document.createElement('span');
        langSpan.textContent = language;
        techDiv.appendChild(langSpan);
    }
    
    // Add topics as tags if available
    if (repo.topics && repo.topics.length) {
        repo.topics.slice(0, 3).forEach(topic => {
            const topicSpan = document.createElement('span');
            topicSpan.textContent = topic;
            techDiv.appendChild(topicSpan);
        });
    }
    
    // Links section
    const linksDiv = document.createElement('div');
    linksDiv.className = 'project-links';
    
    // Code link
    const codeLink = document.createElement('a');
    codeLink.href = repoUrl;
    codeLink.target = '_blank';
    codeLink.textContent = 'Code';
    linksDiv.appendChild(codeLink);
    
    // Live link if available
    if (liveUrl) {
        const liveLink = document.createElement('a');
        liveLink.href = liveUrl;
        liveLink.target = '_blank';
        liveLink.textContent = 'Live';
        linksDiv.appendChild(liveLink);
    }
    
    // Assemble card
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(techDiv);
    card.appendChild(linksDiv);
    
    return card;
}

/**
 * Format repository name for display (convert-dashes to spaces and capitalize)
 */
function formatRepoName(name) {
    return name
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Load GitHub projects into the works section
 */
async function loadGitHubProjects() {
    const projectGrid = document.querySelector('#works .project-grid');
    const seeMoreBtn = document.getElementById('load-more-projects');
    
    if (!projectGrid) return;
    
    // Show loading state
    projectGrid.innerHTML = '<div class="loading">Loading projects...</div>';
    
    // Fetch repositories if not already fetched
    if (allRepos.length === 0) {
        allRepos = await fetchGitHubRepos();
        
        // Handle empty response
        if (!allRepos || allRepos.length === 0) {
            projectGrid.innerHTML = '<div class="error-message">Unable to load projects. Please check back later.</div>';
            if (seeMoreBtn) seeMoreBtn.style.display = 'none';
            return;
        }
        
        // Filter out forks and sort by stars
        allRepos = allRepos
            .filter(repo => !repo.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count);
    }
    
    // Clear loading message
    projectGrid.innerHTML = '';
    
    // Display initial set of projects
    displayProjects(projectGrid, INITIAL_PROJECTS);
    
    // Set up "See More" button
    setupSeeMoreButton();
}

/**
 * Display a specific number of projects
 */
function displayProjects(container, count) {
    // Determine end index for slicing
    const endIndex = Math.min(loadedProjects + count, allRepos.length);
    
    // Create and append cards for the specified projects
    for (let i = loadedProjects; i < endIndex; i++) {
        const card = createProjectCard(allRepos[i]);
        container.appendChild(card);
    }
    
    // Update the count of loaded projects
    loadedProjects = endIndex;
    
    // Update button state
    updateSeeMoreButtonState();
}

/**
 * Set up the "See More" button
 */
function setupSeeMoreButton() {
    const seeMoreBtn = document.getElementById('load-more-projects');
    if (!seeMoreBtn) return;
    
    // Add click event listener
    seeMoreBtn.addEventListener('click', loadMoreProjects);
    
    // Initialize button state
    updateSeeMoreButtonState();
}

/**
 * Load more projects when "See More" is clicked
 */
function loadMoreProjects() {
    const projectGrid = document.querySelector('#works .project-grid');
    if (!projectGrid) return;
    
    displayProjects(projectGrid, PROJECTS_PER_LOAD);
}

/**
 * Update the "See More" button state
 */
function updateSeeMoreButtonState() {
    const seeMoreBtn = document.getElementById('load-more-projects');
    if (!seeMoreBtn) return;
    
    // Disable button if all repos are loaded or max limit reached
    if (loadedProjects >= allRepos.length || loadedProjects >= MAX_PROJECTS) {
        seeMoreBtn.disabled = true;
        seeMoreBtn.textContent = 'No More Projects';
    } else {
        seeMoreBtn.disabled = false;
        seeMoreBtn.textContent = 'See More';
    }
}

// Export functions
window.githubPortfolio = {
    loadGitHubProjects,
    loadMoreProjects,
    fetchGitHubRepos
};
