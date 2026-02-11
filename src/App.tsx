import './App.css'
import RecipeCard from './recipe_card/RecipeCard'
import RadioPicker from './radio_picker/RadioPicker'
import NavTab from './nav-tab/NavTab'
import FormGroup from './form-group/FormGroup'
import AddElementInput from './AddElementInput/AddElementInput'
import { useState, useEffect } from 'react';
import SimpleInput from './SimpleInput/SimpleInput'
import RangePicker from './RangePicker/RangePicker'
import {useTrimmedState} from "./hooks/useTrimmedState.ts";
import { Form, message, Modal, Button, Input } from 'antd';

interface User {
  username: string;
  roles: string[];
  token: string;
}

interface LoginFormValues {
  username: string;
  password: string;
}

interface RegisterFormValues {
  username: string;
  password: string;
  email?: string; // optional if your backend supports it
}

interface Recipe {
  name: string;
  url: string;
  ingredients: string[]; // assuming ingredients are strings; adjust if they're objects
  isSpicy: boolean;
  isMeaty: boolean;
  isSeafood: boolean;
  isExpensive: boolean;
  isSour: boolean;
  isSweet: boolean;
  isSoup: boolean;
  isDietary: boolean;
  isFat: boolean;
  cuisine: string;
  cookingTime: number; // in minutes, or string if it's like "30 mins"
  cookingMethods: string[];
}

interface RawIngredient {
  id: number;
  name: string;
}

interface RawCuisine {
  id: number;
  name: string;
}

interface RawCookMethod {
  id: number;
  name: string;
}

interface RawRecipe {
  id: number;
  name: string;
  url: string;
  time: number;
  isExpensive: boolean;
  isMeaty: boolean;
  isSeafood: boolean;
  isSpicy: boolean;
  isSour: boolean;
  isSweet: boolean;
  isSoup: boolean;
  isDietary: boolean;
  isFat: boolean;
  ingredients: RawIngredient[];
  cuisines: RawCuisine[];
  cookProcess: RawCookMethod[];
}

interface Tag {
  type: 'seafood' | 'meat' | 'spicy' | 'sour' | 'sweet' | 'soup' | 'dietary' | 'fat';
}

function App() {

  const [ingredients, setIngredients] = useState<string[]>([
    'Бекон', 'Брокколи', 'Вода', 'Зеленый горох', 'Итальянские травы',
    'Капуста', 'Картофель', 'Кефир', 'Колбаса', 'Крабовые палочки',
    'Крахмал', 'Креветки', 'Курица', 'Лавровый лист', 'Лимон',
    'Лук', 'Лук зеленый', 'Лук порей', 'Майонез', 'Макароны',
    'Масло растительное', 'Масло сливочное', 'Морковь', 'Мука',
    'Оливковое масло', 'Паприка', 'Перец', 'Перец черный', 'Помидоры',
    'Рис', 'Розмарин', 'Розовый перец', 'Сахар', 'Сливки', 'Сметана',
    'Сода', 'Соевый соус', 'Соль', 'Сосиски', 'Специи', 'Сыр',
    'Сыр плавленый', 'Творог', 'Тесто слоеное', 'Тимьян', 'Томатная паста',
    'Тортилья', 'Укроп', 'Фарш', 'Чеснок', 'Яйцо куриное',
  ]);

  const [cookingMethods, setCookingMethods] = useState<string[]>([
    'Жарка', 'Варка', 'Тушение', 'Запекание', 'Нарезка',
  ]);

  const [cuisines, setCuisines] = useState<string[]>([
    'Итальянская', 'Японская', 'Русская', 'Киатйская', 'Северная',
  ]);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [loginForm] = Form.useForm<LoginFormValues>();
  const [registerForm] = Form.useForm<RegisterFormValues>();


  type RadioValue = 'positive' | 'negative' | 'neutral';

  //Данные для UI
  const [activeTab, setActiveTab] = useState<'search' | 'create'>('search');

  const handleTabClick = (tabId: 'search' | 'create') => {
    setActiveTab(tabId);
  };

  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  //Данные формы поиска
  const [dishName, setDishName] = useTrimmedState('');

  const [budgetPreference, setBudgetPreference] = useState<RadioValue>('neutral');
  const [meatPreference, setMeatPreference] = useState<RadioValue>('neutral');
  const [seafoodPreference, setSeafoodPreference] = useState<RadioValue>('neutral');
  const [spicyPreference, setSpicyPreference] = useState<RadioValue>('neutral');
  const [sourPreference, setSourPreference] = useState<RadioValue>('neutral');
  const [sweetPreference, setSweetPreference] = useState<RadioValue>('neutral');
  const [soupPreference, setSoupPreference] = useState<RadioValue>('neutral');
  const [dietaryPreference, setDietaryPreference] = useState<RadioValue>('neutral');
  const [fatPreference, setFatPreference] = useState<RadioValue>('neutral');

  const [includedIngredients, setIncludedIngredients] = useState<string[]>([]);
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
  const [includedCookingTypes, setIncludedCookingTypes] = useState<string[]>([]);
  const [excludedCookingTypes, setExcludedCookingTypes] = useState<string[]>([]);
  const [includedCuisines, setIncludedCuisines] = useState<string[]>([]);

  const [cookingTime, setCookingTime] = useState<number>(30);

  const [searchResultReturned, setSearchResultReturned] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<Recipe[]>([]);

  //Данные формы создания
  const [creationDishName, setCreationDishName] = useTrimmedState('');
  const [creationUrl, setCreationUrl] = useTrimmedState('');

  const [creationBudgetPreference, setCreationBudgetPreference] = useState<RadioValue>('negative');
  const [creationMeatPreference, setCreationMeatPreference] = useState<RadioValue>('negative');
  const [creationSeafoodPreference, setCreationSeafoodPreference] = useState<RadioValue>('negative');
  const [creationSpicyPreference, setCreationSpicyPreference] = useState<RadioValue>('negative');
  const [creationSourPreference, setCreationSourPreference] = useState<RadioValue>('negative');
  const [creationSweetPreference, setCreationSweetPreference] = useState<RadioValue>('negative');
  const [creationSoupPreference, setCreationSoupPreference] = useState<RadioValue>('negative');
  const [creationDietaryPreference, setCreationDietaryPreference] = useState<RadioValue>('negative');
  const [creationFatPreference, setCreationFatPreference] = useState<RadioValue>('negative');

  const [creationIngredients, setCreationIngredients] = useState<string[]>([]);
  const [creationCookingTypes, setCreationCookingTypes] = useState<string[]>([]);
  const [creationIncludedCuisines, setCreationIncludedCuisines] = useState<string[]>([]);

  const [creationCookingTime, setCreationCookingTime] = useState<number>(30);

  const [creationResultReturned, setCreationResultReturned] = useState<boolean>(false);


  // Fetch data on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp > now) {
          setCurrentUser({
            username: payload.sub,
            roles: payload.roles || [],
            token,
          });
        } else {
          localStorage.removeItem('token');
        }
      } catch (e) {
        console.log(e)
        localStorage.removeItem('token');
      }
    }

    const fetchData = async () => {
      try {
        const ingredientsResponse = await fetch('/api/all_ingredients');
        if (ingredientsResponse.ok) {
          const ingredientsData: string[] = await ingredientsResponse.json();
          if (Array.isArray(ingredientsData) && ingredientsData.length > 0) {
            setIngredients(ingredientsData);
          }
        }

        const methodsResponse = await fetch('/api/all_cook_processes');
        if (methodsResponse.ok) {
          const methodsData: string[] = await methodsResponse.json();
          if (Array.isArray(methodsData) && methodsData.length > 0) {
            setCookingMethods(methodsData);
          }
        }

        const cuisinesResponse = await fetch('/api/all_cuisines');
        if (cuisinesResponse.ok) {
          const cuisinesData: string[] = await cuisinesResponse.json();
          if (Array.isArray(cuisinesData) && cuisinesData.length > 0) {
            setCuisines(cuisinesData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // === AUTHENTICATION ===

  const handleLogin = async (values: LoginFormValues) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.text();
        message.error(`Ошибка входа: ${error}`);
        return;
      }

      const data: { token: string; username: string; roles: string[] } = await response.json();
      localStorage.setItem('token', data.token);
      setCurrentUser({
        username: data.username,
        roles: data.roles,
        token: data.token,
      });
      setIsLoginModalOpen(false);
      message.success('Вход выполнен!');
    } catch (error) {
      console.log(error)
      message.error('Ошибка при входе');
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.text();
        message.error(`Ошибка регистрации: ${error}`);
        return;
      }

      message.success('Регистрация успешна! Войдите.');
      setIsRegisterModalOpen(false);
    } catch (error) {
      console.log(error)
      message.error('Ошибка при регистрации');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    message.success('Вы вышли из системы');
  };


  return (
    <div className="container">
      <header className='main-header'>
        <div className="logo">
          <i className="fas fa-paw"></i>
          <span>Shiba Bites</span>
        </div>
        <button className="login-btn" onClick={currentUser ? handleLogout : () => setIsLoginModalOpen(true)}>
          <i className="fas fa-user"></i>
          {currentUser ? 'Выйти' : 'Войти'}
        </button>
      </header>
      <div className="nav-tabs">
        <NavTab
          title='Поиск рецептов'
          iconClass='fas fa-utensils'
          dataTab='search'
          isActive={activeTab === 'search'}
          onClick={() => handleTabClick('search')}
        />
        {currentUser?.roles?.includes('ROLE_ADMIN') && (
          <NavTab
            title='Создание рецептов'
            iconClass='fas fa-bone'
            dataTab='create'
            isActive={activeTab === 'create'}
            onClick={() => handleTabClick('create')}
          />
        )}
      </div>

      <Modal
        title="Вход"
        open={isLoginModalOpen}
        onCancel={() => setIsLoginModalOpen(false)}
        footer={null}
      >
        <Form form={loginForm} onFinish={handleLogin}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Введите имя пользователя!' }]}
          >
            <Input placeholder="Имя пользователя" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Введите пароль!' }]}
          >
            <Input.Password placeholder="Пароль" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Войти
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Button type="link" onClick={() => {
              setIsLoginModalOpen(false);
              setIsRegisterModalOpen(true);
            }}>
              Регистрация
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Модалка регистрации */}
      <Modal
        title="Регистрация"
        open={isRegisterModalOpen}
        onCancel={() => setIsRegisterModalOpen(false)}
        footer={null}
      >
        <Form form={registerForm} onFinish={handleRegister}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Введите имя пользователя!' }]}
          >
            <Input placeholder="Имя пользователя" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Введите пароль!' }]}
          >
            <Input.Password placeholder="Пароль" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Зарегистрироваться
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Button type="link" onClick={() => {
              setIsRegisterModalOpen(false);
              setIsLoginModalOpen(true);
            }}>
              Уже есть аккаунт? Войти
            </Button>
          </div>
        </Form>
      </Modal>

      <div className="main-content">
        <div className="paw-decor paw-1">
          <i className="fas fa-paw"></i>
        </div>
        <div className="paw-decor paw-2">
          <i className="fas fa-paw"></i>
        </div>


        <div className={`tab-content tab-search ${activeTab === 'search' ? 'active' : ''}`}>

          <h2 className="section-title">
            <i className="fas fa-search"></i> Найди свой идеальный рецепт
          </h2>
          <div className="form-group">
            <div className="form-extended-search">
              <label className='form-extended-search__label'>
                <input
                  type="checkbox"
                  className='form-extended-search__input'
                  checked={isAdvancedSearch}
                  onChange={(e) => setIsAdvancedSearch(e.target.checked)}
                />
                Расширенный поиск
              </label>
            </div>

            <form className="search-form" >

              <FormGroup
                title='Название'
                iconClass='fa-solid fa-file-signature'
              >

                <SimpleInput
                  hint='Название блюда...'
                  value={dishName}
                  onValueChange={setDishName}
                />

              </FormGroup>

              <FormGroup
                title='Включить ингредиенты'
                iconClass='fas fa-plus-circle'
              >
                <AddElementInput
                  hint='Название ингредиента...'
                  onTagsChange={setIncludedIngredients}
                  suggestions={ingredients}
                />

              </FormGroup>

              <FormGroup
                title='Время готовки'
                iconClass='fas fa-clock'
              >

                <RangePicker
                  startFrom={5}
                  upTo={120}
                  value={cookingTime}
                  measure="min"
                  onChange={setCookingTime}
                />

              </FormGroup>

              {isAdvancedSearch && (
                <>
                  <FormGroup
                    title='Исключить ингредиенты'
                    iconClass='fas fa-minus-circle'
                  >

                    <AddElementInput
                      hint='Название ингредиента...'
                      onTagsChange={setExcludedIngredients}
                      suggestions={ingredients}
                    />

                  </FormGroup>

                  <FormGroup
                    title='Предпочтения по бюджету'
                    iconClass='fas fa-coins'
                  >
                    <RadioPicker
                      optionPositive="Только дорогие блюда"
                      optionNegative="Только бюджетные блюда"
                      optionNeutral="Неважно"
                      name="budget"
                      value={budgetPreference}
                      onChange={setBudgetPreference}
                    />

                  </FormGroup>

                  <FormGroup
                    title='Мясо'
                    iconClass='fa-solid fa-drumstick-bite'
                  >

                    <RadioPicker
                      optionPositive="Только мясные блюда"
                      optionNegative="Только блюда без мяса"
                      optionNeutral="Неважно"
                      name="meat"
                      value={meatPreference}
                      onChange={setMeatPreference}
                    />

                  </FormGroup>

                  <FormGroup
                    title='Морепродукты'
                    iconClass='fas fa-fish'
                  >

                    <RadioPicker
                      optionPositive="Только блюда с морепродуктами"
                      optionNegative="Только блюда без морепродуктов"
                      optionNeutral="Неважно"
                      name="seafood"
                      value={seafoodPreference}
                      onChange={setSeafoodPreference}
                    />

                  </FormGroup>

                  <FormGroup
                    title='Острота'
                    iconClass='fas fa-pepper-hot'
                  >
                    <RadioPicker
                      optionPositive="Только острые блюда"
                      optionNegative="Только не острые блюда"
                      optionNeutral="Неважно"
                      name="spicy"
                      value={spicyPreference}
                      onChange={setSpicyPreference}
                    />

                  </FormGroup>

                  <FormGroup
                    title='Кислотность'
                    iconClass='fa-solid fa-lemon'
                  >
                    <RadioPicker
                      optionPositive="Только кислые блюда"
                      optionNegative="Только не кислые блюда"
                      optionNeutral="Неважно"
                      name="sour"
                      value={sourPreference}
                      onChange={setSourPreference}
                    />

                  </FormGroup>

                  <FormGroup
                    title='Сладость'
                    iconClass='fa-solid fa-cookie'
                  >
                    <RadioPicker
                      optionPositive="Только сладкие блюда"
                      optionNegative="Только не сладкие блюда"
                      optionNeutral="Неважно"
                      name="sweet"
                      value={sweetPreference}
                      onChange={setSweetPreference}
                    />

                  </FormGroup>

                  <FormGroup
                    title='Суп?'
                    iconClass='fa-solid fa-bowl-food'
                  >
                    <RadioPicker
                      optionPositive="Только супы"
                      optionNegative="Только не супы"
                      optionNeutral="Неважно"
                      name="soup"
                      value={soupPreference}
                      onChange={setSoupPreference}
                    />

                  </FormGroup>

                  <FormGroup
                    title='Диетическое'
                    iconClass='fa-solid fa-shield-heart'
                  >
                    <RadioPicker
                      optionPositive="Только диетические блюда"
                      optionNegative="Только не диетические блюда"
                      optionNeutral="Неважно"
                      name="dietary"
                      value={dietaryPreference}
                      onChange={setDietaryPreference}
                    />

                  </FormGroup>

                  <FormGroup
                    title='Жирное'
                    iconClass='fa-solid fa-bottle-droplet'
                  >
                    <RadioPicker
                      optionPositive="Только жирные блюда"
                      optionNegative="Только не жирные блюда"
                      optionNeutral="Неважно"
                      name="fat"
                      value={fatPreference}
                      onChange={setFatPreference}
                    />

                  </FormGroup>


                  <FormGroup
                    title='Предпочитаемые кухни'
                    iconClass='fa-solid fa-utensils'
                  >

                    <AddElementInput
                      hint='Название кухни...'
                      onTagsChange={setIncludedCuisines}
                      suggestions={cuisines}
                    />

                  </FormGroup>

                  <FormGroup
                    title='Включить способы приготовления'
                    iconClass='fas fa-fire'
                  >
                    <AddElementInput
                      hint='Название способа готовки...'
                      onTagsChange={setIncludedCookingTypes}
                      suggestions={cookingMethods}
                    />

                  </FormGroup>

                  <FormGroup
                    title='Исключить способы приготовления'
                    iconClass='fas fa-ban'
                  >

                    <AddElementInput
                      hint='Название способа готовки...'
                      onTagsChange={setExcludedCookingTypes}
                      suggestions={cookingMethods}
                    />

                  </FormGroup>
                </>
              )}


            </form>

            <div className="btn-group">
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault(); // because it's inside a <form>

                  setSearchResultReturned(false);

                  // Map your current state to the expected request format
                  const incoming_request = {
                    ingredients: {
                      include: includedIngredients || [],
                      exclude: excludedIngredients || [],
                    },
                    cook_process: {
                      include: includedCookingTypes || [],
                      exclude: excludedCookingTypes || [],
                    },
                    cuisines: {
                      include: includedCuisines || [],
                    },
                    time: {
                      lt: cookingTime || null,
                      gt: null
                    },

                    preparation_needed: null,
                    dish_name: dishName.trim() || null,

                    is_expensive: budgetPreference === 'positive' ? true :
                      budgetPreference === 'negative' ? false : null,

                    is_meaty: meatPreference === 'positive' ? true :
                      meatPreference === 'negative' ? false : null,

                    is_seafood: seafoodPreference === 'positive' ? true :
                      seafoodPreference === 'negative' ? false : null,

                    is_spicy: spicyPreference === 'positive' ? true :
                      spicyPreference === 'negative' ? false : null,

                    is_sour: sourPreference === 'positive' ? true :
                      sourPreference === 'negative' ? false : null,

                    is_sweet: sweetPreference === 'positive' ? true :
                      sweetPreference === 'negative' ? false : null,

                    is_soup: soupPreference === 'positive' ? true :
                      soupPreference === 'negative' ? false : null,

                    is_dietary: dietaryPreference === 'positive' ? true :
                      dietaryPreference === 'negative' ? false : null,

                    is_fat: fatPreference === 'positive' ? true :
                      fatPreference === 'negative' ? false : null,
                  };

                  const jsonValues = JSON.stringify(incoming_request);
                  console.log(jsonValues)

                  fetch('/api/search', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      ...(currentUser?.token && { Authorization: `Bearer ${currentUser.token}` }),
                    },
                    body: jsonValues,
                  })
                    .then((response) => {
                      setSearchResultReturned(true);
                      if (response.ok) {
                        return response.json();
                      } else {
                        setSearchResult([]);
                        throw new Error(`Error: ${response.status}`);
                      }
                    })
                    .then((data: RawRecipe[]) => {
                      const transformed: Recipe[] = data.map((item) => ({
                        name: item.name.trim(),
                        url: item.url.trim(),
                        ingredients: item.ingredients.map(ing => ing.name),
                        isSpicy: item.isSpicy,
                        isMeaty: item.isMeaty,
                        isSeafood: item.isSeafood,
                        isSour: item.isSour,
                        isSweet: item.isSweet,
                        isSoup: item.isSoup,
                        isDietary: item.isDietary,
                        isFat: item.isFat,
                        isExpensive: item.isExpensive,
                        cuisine: item.cuisines[0]?.name || 'Unknown',
                        cookingTime: item.time,
                        cookingMethods: item.cookProcess.map(m => m.name),
                      }));
                      setSearchResult(transformed);
                      console.log('Success:', data);
                      message.success('Search completed successfully!');
                    })
                    .catch((error) => {
                      console.error('Error:', error);
                      message.error('There was an issue with your search. Please try again.');
                    });
                }}
              >
                <i className="fas fa-search"></i> Поиск
              </button>


              <button className="btn btn-outline">
                <i className="fas fa-broom"></i> Сбросить фильтры
              </button>
            </div>

            {searchResultReturned && (
              <div className="results-section">
                <div className="results-header">
                  <h3 className="section-title">
                    <i className="fas fa-utensils"></i> Найденные рецепты
                  </h3>
                  <div className="results-count">
                    {searchResult.length} {searchResult.length === 1 ? 'рецепт найден' : searchResult.length < 5 ? 'рецепта найдено' : 'рецептов найдено'}
                  </div>
                </div>

                <div className="recipe-grid">
                  {searchResult.map((recipe, index) => {
                    // Build tags based on boolean flags
                    const tags: Tag[] = [];
                    if (recipe.isMeaty) tags.push({ type: 'meat' });
                    if (recipe.isSeafood) tags.push({ type: 'seafood' });
                    if (recipe.isSpicy) tags.push({ type: 'spicy' });
                    if (recipe.isSour) tags.push({ type: 'sour' });
                    if (recipe.isSweet) tags.push({ type: 'sweet' });
                    if (recipe.isSoup) tags.push({ type: 'soup' });
                    if (recipe.isDietary) tags.push({ type: 'dietary' });
                    if (recipe.isFat) tags.push({ type: 'fat' });

                    // Optional: add cuisine as a tag or keep it as country
                    // For now, we use cuisine as "country" per your request

                    return (
                      <RecipeCard
                        key={index} // ideally use a unique ID if available, e.g., recipe.id or recipe.url
                        title={recipe.name}
                        url={recipe.url.trim()} // clean up any extra spaces
                        country={recipe.cuisine} // using cuisine as country
                        flagEmoji="" // you may need to map cuisine to emoji if desired
                        ingredients={recipe.ingredients}
                        tags={tags}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>

        <div className={`tab-content tab-create ${activeTab === 'create' ? 'active' : ''}`}>
          <h2 className="section-title">
            <i className="fas fa-bone"></i> Share Your Recipe
          </h2>

          <form className="create-form">

            <FormGroup
              title='Название блюда'
              iconClass='fas fa-heading'
            >
              <SimpleInput
                hint='Название блюда...'
                value={creationDishName}
                onValueChange={setCreationDishName}
              />

            </FormGroup>

            <FormGroup
              title='Ссылка на оригинальный рецепт'
              iconClass='fas fa-heading'
            >
              <SimpleInput
                hint='Ссылка на оригинальный рецепт...'
                value={creationUrl}
                onValueChange={setCreationUrl}
              />

            </FormGroup>

            <FormGroup
              title='Ингредиенты'
              iconClass='fas fa-carrot'
            >
              <AddElementInput
                hint='Название ингредиента...'
                onTagsChange={setCreationIngredients}
                suggestions={ingredients}
              />

            </FormGroup>

            <FormGroup
              title='Время готовки'
              iconClass='fas fa-clock'
            >

              <RangePicker
                startFrom={5}
                upTo={120}
                value={creationCookingTime}
                measure="min"
                onChange={setCreationCookingTime}
              />

            </FormGroup>

            <FormGroup
              title='Ценовая категория блюда'
              iconClass='fas fa-coins'
            >
              <RadioPicker
                optionPositive='Дорогое'
                optionNegative='Бюджетное'
                name='budget'
                value={creationBudgetPreference}
                onChange={setCreationBudgetPreference}
              />

            </FormGroup>

            <FormGroup
              title='Содержания мяса'
              iconClass='fa-solid fa-drumstick-bite'
            >

              <RadioPicker
                optionPositive='Мясное блюдо'
                optionNegative='Блюдо без мяса'
                name='meat'
                value={creationMeatPreference}
                onChange={setCreationMeatPreference}
              />

            </FormGroup>

            <FormGroup
              title='Содержание морепродуков'
              iconClass='fas fa-fish'
            >

              <RadioPicker
                optionPositive='Блюдо содержит морепродукты'
                optionNegative='Блюдо не содержит морепродукты'
                name='seafood'
                value={creationSeafoodPreference}
                onChange={setCreationSeafoodPreference}
              />

            </FormGroup>

            <FormGroup
              title='Острота'
              iconClass='fas fa-pepper-hot'
            >
              <RadioPicker
                optionPositive='Острое блюдо'
                optionNegative='Не острое блюдо'
                name='spicy'
                value={creationSpicyPreference}
                onChange={setCreationSpicyPreference}
              />

            </FormGroup>

            <FormGroup
              title='Кислотность'
              iconClass='fa-solid fa-lemon'
            >
              <RadioPicker
                optionPositive="Кислое блюдо"
                optionNegative="Не кислое блюдо"
                name="sour"
                value={creationSourPreference}
                onChange={setCreationSourPreference}
              />

            </FormGroup>

            <FormGroup
              title='Сладость'
              iconClass='fa-solid fa-cookie'
            >
              <RadioPicker
                optionPositive="Сладкое блюдо"
                optionNegative="Не сладкое блюдо"
                name="sweet"
                value={creationSweetPreference}
                onChange={setCreationSweetPreference}
              />

            </FormGroup>

            <FormGroup
              title='Суп?'
              iconClass='fa-solid fa-bowl-food'
            >
              <RadioPicker
                optionPositive="Суп"
                optionNegative="Не суп"
                name="soup"
                value={creationSoupPreference}
                onChange={setCreationSoupPreference}
              />

            </FormGroup>

            <FormGroup
              title='Диетическое'
              iconClass='fa-solid fa-shield-heart'
            >
              <RadioPicker
                optionPositive="Диетическое блюдо"
                optionNegative="Не диетическое блюдо"
                name="dietary"
                value={creationDietaryPreference}
                onChange={setCreationDietaryPreference}
              />

            </FormGroup>

            <FormGroup
              title='Жирное'
              iconClass='fa-solid fa-bottle-droplet'
            >
              <RadioPicker
                optionPositive="Жирное блюдо"
                optionNegative="Не жирное блюдо"
                name="fat"
                value={creationFatPreference}
                onChange={setCreationFatPreference}
              />

            </FormGroup>

            <FormGroup
              title='Блюдо принадлежит к кухням'
              iconClass='fa-solid fa-utensils'
            >

              <AddElementInput
                hint='(Японская, Итальянская ...)'
                onTagsChange={setCreationIncludedCuisines}
                suggestions={cuisines}
              />

            </FormGroup>

            <FormGroup
              title='Блюдо включает способы приготовления'
              iconClass='fas fa-fire'
            >
              <AddElementInput
                hint='(Гриль, Варка, Жарка ...)'
                onTagsChange={setCreationCookingTypes}
                suggestions={cookingMethods}
              />
            </FormGroup>
          </form>

          <div className="btn-group">
            <button
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault(); // because it's inside a <form>

                setCreationResultReturned(false);

                // Map your current state to the expected request format
                const incoming_request = {
                  ingredients: creationIngredients || [],
                  cook_process: creationCookingTypes || [],
                  cuisines: creationIncludedCuisines || [],
                  time: creationCookingTime || null,
                  preparation_needed: null, // set if you have this logic
                  instruction: null,
                  url: creationUrl || "www.google.com",
                  dish_name: creationDishName || null,

                  is_expensive: creationBudgetPreference === 'positive' ? true :
                    creationBudgetPreference === 'negative' ? false : null,

                  is_meaty: creationMeatPreference === 'positive' ? true :
                    creationMeatPreference === 'negative' ? false : null,

                  is_seafood: creationSeafoodPreference === 'positive' ? true :
                    creationSeafoodPreference === 'negative' ? false : null,

                  is_spicy: creationSpicyPreference === 'positive' ? true :
                    creationSpicyPreference === 'negative' ? false : null,

                  is_sour: creationSourPreference === 'positive' ? true :
                    creationSourPreference === 'negative' ? false : null,

                  is_soup: creationSoupPreference === 'positive' ? true :
                    creationSoupPreference === 'negative' ? false : null,

                  is_sweet: creationSweetPreference === 'positive' ? true :
                    creationSweetPreference === 'negative' ? false : null,

                  is_dietary: creationDietaryPreference === 'positive' ? true :
                    creationDietaryPreference === 'negative' ? false : null,

                  is_fat: creationFatPreference === 'positive' ? true :
                    creationFatPreference === 'negative' ? false : null,

                };

                const jsonValues = JSON.stringify(incoming_request);
                console.log(jsonValues)

                fetch('/api/create', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    ...(currentUser?.token && { Authorization: `Bearer ${currentUser.token}` }),
                  },
                  body: jsonValues,
                })
                  .then((response) => {
                    setCreationResultReturned(true);
                    if (response.ok) {
                      console.log(creationResultReturned)
                      alert("Рецепт добавлен")
                    } else {
                      alert("Ошибка при создании рецепта")
                      throw new Error(`Error: ${response.status}`);
                    }
                  })
                  .catch((error) => {
                    console.error('Error:', error);
                    message.error('There was an issue with your search. Please try again.');
                  });
              }}
            >
              <i className="fas fa-search"></i> Добавить
            </button>
            <button className="btn btn-outline">
              <i className="fas fa-times"></i> Cancel
            </button>
          </div>
        </div>



      </div>
    </div>
  )
}

export default App
