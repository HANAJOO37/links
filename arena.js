// This allows us to process/render the descriptions, which are in Markdown!
// More about Markdown: https://en.wikipedia.org/wiki/Markdown
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js'
document.head.appendChild(markdownIt)



// Okay, Are.na stuff!
let channelSlug = 'brain-pop-rocks' // The “slug” is just the end of the URL



// First, let’s lay out some *functions*, starting with our basic metadata:
let placeChannelInfo = (data) => {
	// Target some elements in your HTML:
	let channelTitle = document.getElementById('channel-title')
	let channelDescription = document.getElementById('channel-description')
	let channelCount = document.getElementById('channel-count')
	let channelLink = document.getElementById('channel-link')

	// Then set their content/attributes to our data:
	channelTitle.innerHTML = data.title
	channelDescription.innerHTML = window.markdownit().render(data.metadata.description) // Converts Markdown → HTML
	channelCount.innerHTML = data.length
	channelLink.href = `https://www.are.na/channel/${channelSlug}`
}



// Then our big function for specific-block-type rendering:
let renderBlock = (block) => {
	// To start, a shared `ul` where we’ll insert all our blocks
	let channelBlocks = document.getElementsByClassName('channel-blocks')

	// Links!
	if (block.class == 'Link') {
		let linkItem =
			`
			<li class="file">
				<p><em>Link</em></p>
				<picture>
					<source media="(max-width: 428px)" srcset="${ block.image.thumb.url }">
					<source media="(max-width: 640px)" srcset="${ block.image.large.url }">
					<img src="${ block.image.original.url }">
				</picture>
				<h3>${ block.title }</h3>
				${ block.description_html }
				<p><a href="${ block.source.url }">See the original ↗</a></p>
			</li>
			`
		channelBlocks.insertAdjacentHTML('beforeend', linkItem)
	}

	// Images!
	else if (block.class == 'Image') {
		let imageItem =
            `
            <li class="file">
                <p><em>Image</em></p>
                <figure>
                <img src="${ block.image.original.url }" alt="${ block.title }">
                </figure>
            </li>
            `
        channelBlocks.insertAdjacentHTML('beforeend', imageItem)
	}

	// Text!
	else if (block.class == 'Text') {
        let textItem =
            `
            <li class="file">
                <p><em>Text</em></p>
                ${ block.content_html }
            </li>
            `
        channelBlocks.insertAdjacentHTML('beforeend', textItem)
    }

	// Uploaded (not linked) media…
	else if (block.class == 'Attachment') {
		let attachment = block.attachment.content_type // Save us some repetition

		// Uploaded videos!
		if (attachment.includes('video')) {
			// …still up to you, but we’ll give you the `video` element:
			let videoItem =
				`
				<li class="file">
					<p><em>Video</em></p>
					<video controls src="${ block.attachment.url }"></video>
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', videoItem)
			// More on video, like the `autoplay` attribute:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
		}

		// Uploaded PDFs!
        else if (attachment.includes('pdf')) {
			let pdfItem =
                `
				<li class="file">
                    <iframe src="${ block.attachment.url }" frameborder="0" allowfullscreen></iframe>
                </li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', pdfItem);
		}

		// Uploaded audio!
		else if (attachment.includes('audio')) {
			// …still up to you, but here’s an `audio` element:
			let audioItem =
				`
				<li class="file">
					<p><em>Audio</em></p>
					<audio controls src="${ block.attachment.url }"></video>
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', audioItem)
			// More on audio: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
		}
	}

	// Linked media…
	else if (block.class == 'Media') {
		let embed = block.embed.type

		// Linked video!
		if (embed.includes('video')) {
			// …still up to you, but here’s an example `iframe` element:
			let linkedVideoItem =
				`
				<li class="file">
					<p><em>Linked Video</em></p>
					${ block.embed.html }
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', linkedVideoItem)
			// More on iframe: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
		}

		// Linked audio!
		else if (embed.includes('rich')) {
			// …up to you!
		}
	}
}



// It‘s always good to credit your work:
let renderUser = (user, container) => { // You can have multiple arguments for a function!
	let userAddress =
		`
		<address>
			<img src="${ user.avatar_image.display }">
			<h3>${ user.first_name }</h3>
			<p><a href="https://are.na/${ user.slug }">Are.na profile ↗</a></p>
		</address>
		`
	container.insertAdjacentHTML('beforeend', userAddress)
}



function getRandomContent(data) {
	const randomIndex = Math.floor(Math.random() * data.contents.length);
	return data.contents[randomIndex];
}

function renderBlock(content) {
	const contentElement = document.createElement('div'); // 콘텐츠를 감싸는 div 생성
	contentElement.innerHTML = content; // 랜덤 콘텐츠 HTML을 div에 추가
	return contentElement;
}

// 랜덤 콘텐츠 
document.getElementById("random-button").addEventListener("click", function() {
	const randomContent = getRandomContent(data);
	const channelBlocks = document.querySelector('.channel-blocks');
	channelBlocks.innerHTML = "";
	channelBlocks.appendChild(renderBlock(randomContent)); 
});

// Now that we have said what we can do, go get the data:
fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
	.then((response) => response.json()) // Return it as JSON data
	.then((data) => { // Do stuff with the data
		console.log(data) // Always good to check your response!
		placeChannelInfo(data) // Pass the data to the first function

		// Loop through the `contents` array (list), backwards. Are.na returns them in reverse!
		data.contents.reverse().forEach((block) => {
			// console.log(block) // The data for a single block
			renderBlock(block) // Pass the single block data to the render function
		})

		// Also display the owner and collaborators:
		let channelUsers = document.getElementById('channel-users') // Show them together
		data.collaborators.forEach((collaborator) => renderUser(collaborator, channelUsers))
		renderUser(data.user, channelUsers)
	})


	


	//window.addEventListener("load", function() {
	// 	hideAllFiles();
	//   });
	
	// function hideAllFiles() {
	//   const files = document.querySelectorAll(".file");
	//   for (const file of files) {
	// 	file.classList.add("hidden");
	//   }
	// }
	
	// document.getElementById("showRandomFileButton").addEventListener("click", showRandomFile);
	
	// function showRandomFile() {
	//   const files = document.querySelectorAll(".file");
	//   for (const file of files) {
	// 	file.classList.remove("hidden");
	//   }
	//   const randomIndex = Math.floor(Math.random() * files.length);
	//   const file = files[randomIndex];
	//   file.classList.add("visible");
	// }
