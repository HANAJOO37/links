// This allows us to process/render the descriptions, which are in Markdown!
// More about Markdown: https://en.wikipedia.org/wiki/Markdown
let markdownIt = document.createElement('script');
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js';
document.head.appendChild(markdownIt);

// Okay, Are.na stuff!
let channelSlug = 'brain-pop-rocks'; // The “slug” is just the end of the URL

// First, let’s lay out some functions, starting with our basic metadata:
let placeChannelInfo = (data) => {
    // Target some elements in your HTML:
    let channelTitle = document.getElementById('channel-title');
    channelTitle.innerHTML = data.title;
};

// It‘s always good to credit your work:
let renderUser = (user, container) => {
    let userAddress =
        `
        <address>
            <h5>${user.first_name}</h5>
            <h6><a href="https://are.na/${user.slug}" target="_blank">Are.na profile</a></h6>
        </address>
        `;
    container.insertAdjacentHTML('beforeend', userAddress);
};

fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        placeChannelInfo(data);

        // Display the owner and collaborators:
        let channelUsers = document.getElementById('channel-users');
        data.collaborators.forEach((collaborator) => renderUser(collaborator, channelUsers));
        renderUser(data.user, channelUsers);
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });