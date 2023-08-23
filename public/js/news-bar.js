$(document).ready(function() {
    const apiKey = '29b0a07a97700791bcac44414e683f5d';
    const apiUrl = `https://gnews.io/api/v4/search?q=phone&top-headlines&category=technology&lang=he&country=il&max=10&apikey=${apiKey}`;
  
    // Make an API request to fetch news data
    $.get(apiUrl, function(data) {
      const articles = data.articles;
      const sliderContainer = $('#news-slider');
  
      articles.forEach(function(article) {
        const slide = $('<div>').addClass('slide');
  
        // Create an anchor tag with the title linked to the original article
        const titleLink = $('<a>')
          .attr('href', article.url)
          .attr('target', '_blank') // Open link in a new tab
          .text(article.title);
  
        // Append the title link to the slide
        slide.append(titleLink);
  
        // Append the slide to the slider container
        sliderContainer.append(slide);
      });
  
      // Initialize the slick-carousel slider
      sliderContainer.slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000 // Adjust the speed (in milliseconds) between slides
      });
    }).fail(function(error) {
      console.error('Error fetching news data:', error);
    });
  });