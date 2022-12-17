single_mealEl = document.getElementById('single-meal');

const btns = Array.from(document.querySelectorAll('button[class^=category-btn]'));
let current_chosen_categories = [];

const categories_restrictions = {
        "Beef" : 42,
        "Chicken" : 35,
        "Dessert" : 64,
        "Lamb" : 14,
        "Miscellaneous" : 11,
        "Pork" : 19,
        "Seafood" : 28,
        "Side" : 16,
        "Vegetarian" : 63,
        "Vegan" : 3,
        "Breakfast" : 7
};
function updateChosenCategories() {
    current_chosen_categories = btns.filter(elem => elem.classList.contains('is-active'));
}

// Fetch meal by ID
function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(res => {
            addMealToDOM(res.meals[0]);
        });
}


btns.forEach(btn => {
    btn.addEventListener('click', event => {
        btn.classList.toggle('is-active');
    });
});



// Fetch random meal from API
function getRandomMeal() {
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            addMealToDOM(data.meals[0]);
        });
}



// Add meal to DOM
function addMealToDOM(meal) {
    const ingredients = [];
    // Get all ingredients from the object. Up to 20
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(
                `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
            );
        } else {
            // Stop if no more ingredients
            break;
        }
    }

    single_mealEl.innerHTML = `
		<div class="row">
			<div class="columns five">
			<h3>${meal.strMeal}</h3>
				<img src="${meal.strMealThumb}" alt="Meal Image">
				${meal.strCategory ? `<p><strong>Category:</strong> ${meal.strCategory}</p>` : ''}
				${meal.strArea ? `<p><strong>Area:</strong> ${meal.strArea}</p>` : ''}
				${meal.strTags ? `<p><strong>Tags:</strong> ${meal.strTags.split(',').join(', ')}</p>` : ''}
				<h4>Ingredients:</h4>
				<ul>
					${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
				</ul>
			</div>
			<div class="columns seven">
			    <h4>Instructions</h4>
				<p>${meal.strInstructions}</p>
			</div>
		</div>
		${meal.strYoutube ? `
		<div class="row">
			<h4>Video Recipe</h4>
			<div class="videoWrapper">
				<iframe width="420" height="315"
				src="https://www.youtube.com/embed/${meal.strYoutube.slice(-11)}">
				</iframe>
			</div>
		</div>` : ''}
	`;
}

function chooseRandomMealByCategory() {
    updateChosenCategories();
    if(current_chosen_categories.length == 0 || current_chosen_categories.length == btns.length) {
        getRandomMeal();
    } else {
        let chosen_category_name = '';
        let random_meal_position = 0;
        if(current_chosen_categories.length == 1)
            chosen_category_name = current_chosen_categories[0].id;
        else
            chosen_category_name = current_chosen_categories[Math.floor(Math.random() * current_chosen_categories.length)].id;

        random_meal_position = Math.floor(Math.random() * categories_restrictions[chosen_category_name]);

        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${chosen_category_name}`)
            .then(res => res.json())
            .then(data => {
                const meal = data.meals[random_meal_position]['idMeal'];
                getMealById(meal);
            });
    }
}


//  Event listeners
random.addEventListener('click', chooseRandomMealByCategory);

