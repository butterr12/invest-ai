<script>
    import { onMount } from 'svelte';
  
    let companyA = '';
    let companyB = '';
    let suggestions = [];
    let showDropdownA = false;
    let showDropdownB = false;
    let isComparing = false;  // To track if we're in the process of comparing
  
    const companies = [
      { name: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com' },
      { name: 'Apple', logo: 'https://logo.clearbit.com/apple.com' },
      { name: 'BP', logo: 'https://logo.clearbit.com/bp.com' },
      { name: 'Chevron', logo: 'https://logo.clearbit.com/chevron.com' },
      { name: 'ExxonMobil', logo: 'https://logo.clearbit.com/exxonmobil.com' },
      { name: 'Ford', logo: 'https://logo.clearbit.com/ford.com' },
      { name: 'General Motors', logo: 'https://logo.clearbit.com/gm.com' },
      { name: 'Google', logo: 'https://logo.clearbit.com/google.com' },
      { name: 'Microsoft', logo: 'https://logo.clearbit.com/microsoft.com' },
      { name: 'Shell', logo: 'https://logo.clearbit.com/shell.com' },
      { name: 'Tesla', logo: 'https://logo.clearbit.com/tesla.com' },
      { name: 'Toyota', logo: 'https://logo.clearbit.com/toyota.com' }
    ].sort((a, b) => a.name.localeCompare(b.name));
  
    function filterCompanies(query) {
      return companies.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  
    function selectCompanyA(name) {
      companyA = name;
      showDropdownA = false;
    }
  
    function selectCompanyB(name) {
      companyB = name;
      showDropdownB = false;
    }
  
    // This function will fetch and preprocess articles for both companies
    async function fetchAndCompare() {
      isComparing = true; // Set the comparing state
  
      try {
        // Example: Fetch 20 articles for each company (replace with actual logic)
        const articlesA = await fetchArticles(companyA);
        const articlesB = await fetchArticles(companyB);
  
        // Preprocess PDFs (you need to define preprocessPDF function)
        const processedA = await preprocessPDFs(articlesA);
        const processedB = await preprocessPDFs(articlesB);
  
        // Get predictions from the Hugging Face model (replace with actual API call)
        const predictionsA = await getSentimentPrediction(processedA);
        const predictionsB = await getSentimentPrediction(processedB);
  
        // Handle predictions
        console.log(predictionsA, predictionsB); // Replace with your logic
  
        alert('Comparison complete!');
      } catch (error) {
        console.error('Error comparing:', error);
        alert('An error occurred. Please try again.');
      } finally {
        isComparing = false; // Reset comparing state
      }
    }
  
    const apiKey = import.meta.env.VITE_NEWS_API_KEY;

    async function fetchArticles(company) {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(company)}&pageSize=20&apiKey=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || !data.articles) {
        throw new Error('Failed to fetch articles');
      }

      return data.articles.map(article =>
        article.content || article.description || article.title
      );
    }


  
    // Preprocess PDFs for model input (replace with actual logic)
    async function preprocessPDFs(articles) {
      // This should convert articles into the format the model expects
      return articles.map(article => article); // Replace with actual processing logic
    }
  
    // Example of using a Hugging Face model (replace with actual API call)
    async function getSentimentPrediction(articles) {
      const modelAPI = 'https://huggingface.co/butterr12/climatesentiment';
      // Assuming you use fetch to get predictions (replace with actual API logic)
      const response = await fetch(modelAPI, {
        method: 'POST',
        body: JSON.stringify({ inputs: articles }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      return data;
    }
  </script>
  
  <main class="container">
    <h1 class="logo">invest.ai</h1>
    <p class="tagline">Get data-driven insights on the stocks you care about.</p>
  
    <div class="form">
      <!-- Company A -->
      <div class="input-wrapper">
        <input
          type="text"
          class="input"
          placeholder="Search first company..."
          bind:value={companyA}
          on:input={() => {
            suggestions = filterCompanies(companyA);
            showDropdownA = true;
          }}
        />
        {#if showDropdownA && suggestions.length > 0}
          <div class="dropdown">
            {#each suggestions as company}
              <div class="dropdown-item" on:click={() => selectCompanyA(company.name)}>
                <img src={company.logo} alt="logo" class="logo-icon" />
                {company.name}
              </div>
            {/each}
          </div>
        {/if}
      </div>
  
      <!-- Company B -->
      <div class="input-wrapper">
        <input
          type="text"
          class="input"
          placeholder="Search second company..."
          bind:value={companyB}
          on:input={() => {
            suggestions = filterCompanies(companyB);
            showDropdownB = true;
          }}
        />
        {#if showDropdownB && suggestions.length > 0}
          <div class="dropdown">
            {#each suggestions as company}
              <div class="dropdown-item" on:click={() => selectCompanyB(company.name)}>
                <img src={company.logo} alt="logo" class="logo-icon" />
                {company.name}
              </div>
            {/each}
          </div>
        {/if}
      </div>
  
      <button
      class="compare-btn"
      class:disabled-style={!companyA || !companyB || isComparing}
      on:click={() => {
        if (!companyA || !companyB || isComparing) return;
        fetchAndCompare();
      }}
      disabled={!companyA || !companyB || isComparing}
    >
      {isComparing ? 'Comparing...' : 'Compare'}
    </button>
    
    
    </div>
  </main>
  

<style>
	:global(body) {
		margin: 0;
		font-family: 'Inter', sans-serif;
		background: linear-gradient(to bottom, #e9f5ec, #ffffff);
		color: #1a1a1a;
	}

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 5rem 1rem;
		min-height: 100vh;
		background: linear-gradient(135deg, #e8f8f0, #ffffff);
	}

	.logo {
		font-size: 2.8rem;
		font-weight: 800;
		text-transform: lowercase;
		color: #2f855a;
		margin-bottom: 0.25rem;
	}

	.tagline {
		font-size: 1.15rem;
		color: #3a3a3a;
		margin-bottom: 2.5rem;
		text-align: center;
		max-width: 540px;
		line-height: 1.6;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
		max-width: 420px;
		position: relative;
	}

	.input-wrapper {
		position: relative;
	}

	.input {
		width: 100%;
		padding: 1rem;
		font-size: 1rem;
		border-radius: 12px;
		border: 1px solid #d0e8dc;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
		transition: border 0.3s ease;
	}

	.input:focus {
		border-color: #38a169;
		outline: none;
	}

	.dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: white;
		border: 1px solid #e2e8f0;
		border-top: none;
		border-radius: 0 0 12px 12px;
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
		z-index: 10;
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		padding: 0.85rem 1rem;
		cursor: pointer;
		transition: background 0.2s;
		font-weight: 500;
	}

	.dropdown-item:hover {
		background-color: #f0fff4;
	}

	.logo-icon {
		width: 24px;
		height: 24px;
		margin-right: 0.75rem;
		border-radius: 4px;
		object-fit: contain;
	}

	.disabled-style {
  cursor: not-allowed;
  opacity: 0.7;
}

.compare-btn {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #38a169;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(56, 161, 105, 0.2);
  transition: opacity 0.3s, cursor 0.3s;
}
</style>
