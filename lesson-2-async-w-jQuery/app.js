/* eslint-env jquery */


(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

		/* UNSPLASH */
		// handling XMLHttpRequest with jQuery .ajax()
		$.ajax({
		    url: 'https://api.unsplash.com/search/photos?page=1&query=${searchedForText}',
		    headers: {
		    	Authorization: 'Client-ID c2527a62971ea8d537f44eac3b6397bf9e88ea4ada8400131d3bcfd22481c0c7'
		    }

		}).done(addImage)
		.fail(function(err) {
			requestError(err, 'image');
		});


		/* NYT */
		$.ajax({
		    url: `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=68bec75cdab74728b85e1e916a9ba0c5`
		}).done(addArticles)
		.fail(function(err) {
			requestError(err, 'articles');
		});
	});


	// Function for adding images
	function addImage(data) {
		let htmlContent = '';

		if (data && data.results && data.results.length > 1) {
		    const firstImage = data.results[0];
		    htmlContent = '<figure><img src="${firstImage.urls.regular}" alt="${searchedForText}"><figcaption>${searchedForText} by ${firstImage.user.name}</figcaption></figure>';
		} else {
			htmlContent = '<div class="error-no-image">No images available</div>'
		}
		responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
	};


	// Function for adding articles
	function addArticles (data) {
		let htmlContent = '';

		if (data.response && data.response.docs && data.response.docs.length > 1) {
			const articles = data.response.docs;
			htmlContent = '<ul>' + articles.map(article => '<li class="article"><h2><a href="${article.web_url}">${article.headline.main}</a></h2><p>${article.snippet}</p></li>').join('') + '</ul>';
		} else {
			htmlContent = '<div class="error-no-articles">No articles available</div>'
		}
		responseContainer.insertAdjacentHTML('beforeend', htmlContent);
	};

	function requestError(e, part) {
	    console.log(e);
	    responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
	}
})();