/**
 * GitHub Projects Integration for Portfolio
 * Fetches GitHub repositories and generates project cards dynamically
 */

// Configuration
const GITHUB_USERNAME = 'NishanBhattarai327';
const MAX_PROJECTS = 16;  // Maximum number of projects to display

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
    if (!projectGrid) return;
    
    // Show loading state
    projectGrid.innerHTML = '<div class="loading">Loading projects...</div>';
    
    // Fetch repositories
    const repos = await fetchGitHubRepos();
    
    // Clear loading message
    projectGrid.innerHTML = '';
    
    // Handle empty response
    if (!repos || repos.length === 0) {
        projectGrid.innerHTML = '<div class="error-message">Unable to load projects. Please check back later.</div>';
        return;
    }
    
    // Filter out forks and sort by stars (optional)
    const filteredRepos = repos
        .filter(repo => !repo.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count);
    
    // Create project cards (limited to MAX_PROJECTS)
    filteredRepos.slice(0, MAX_PROJECTS).forEach(repo => {
        const card = createProjectCard(repo);
        projectGrid.appendChild(card);
    });
}

// Export functions
window.githubPortfolio = {
    loadGitHubProjects,
    fetchGitHubRepos
};
