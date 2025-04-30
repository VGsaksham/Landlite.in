document.addEventListener('DOMContentLoaded', function() {
  // Get all spec sections
  const specSections = document.querySelectorAll('.spec-section');
  
  // Add click event listeners to each section
  specSections.forEach(section => {
    const heading = section.querySelector('h2');
    
    if (heading) {
      heading.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation(); // Prevent event from bubbling up
        
        // Toggle active class
        const isActive = section.classList.contains('active');
        
        // First close all sections
        specSections.forEach(s => s.classList.remove('active'));
        
        // Then open the clicked one (if it wasn't already open)
        if (!isActive) {
          section.classList.add('active');
          
          // Ensure the section is visible in the scrollable area
          setTimeout(() => {
            const specsContainer = section.closest('.product-info');
            if (specsContainer) {
              section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }, 300);
        }
      });
    }
  });
  
  // Auto-open the first section on page load
  if (specSections.length > 0) {
    specSections[0].classList.add('active');
  }
}); 