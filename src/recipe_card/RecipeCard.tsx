// RecipeCard.tsx
import './RecipeCard.css';

// Определяем тип для тега
interface Tag {
  type: 'seafood' | 'meat' | 'spicy' | 'sour' | 'sweet' | 'soup' | 'dietary' | 'fat';
}

// Определяем тип для пропсов компонента
interface RecipeCardProps {
  title: string;
  url: string;
  country: string;
  flagEmoji?: string;        // необязательные поля
  flagClass?: string;
  ingredients: string[];
  tags: Tag[];
}

const RecipeCard = ({
  title,
  url,
  country,
  flagEmoji,
  flagClass,
  ingredients,
  tags,
}: RecipeCardProps) => {
  return (
    <div className="recipe-card">
      <div className="recipe-card__header">
        <div>
          <h3 className="recipe-card__title">{title}</h3>
          <a href={url} className="recipe-card__recipe-url">
            <i className="fas fa-link"></i> {url}
          </a>
        </div>
        <div className="recipe-card__country-flag">
          {flagEmoji ? (
            <span>{flagEmoji}</span>
          ) : flagClass ? (
            <span className={`flag-icon ${flagClass}`}></span>
          ) : null}
          {country}
        </div>
      </div>
      <div className="recipe-card__body">
        <h4 className="recipe-card__ingredients-title">
          <i className="fas fa-carrot"></i> Основные ингредиенты
        </h4>
        <div className="recipe-card__ingredients-list">
          {ingredients.map((ingredient, idx) => (
            <span key={idx} className="recipe-card__ingredient">
              {ingredient}
            </span>
          ))}
        </div>
        <div className="recipe-card__tags">
          {tags.map((tag, idx) => {
            const tagClass = `recipe-card__tag ${tag.type}-tag`;
            const iconMap = {
              seafood: 'fa-solid fa-fish',
              meat: 'fa-solid fa-drumstick-bite',
              spicy: 'fas fa-pepper-hot',
              sour: 'fa-solid fa-lemon',
              sweet: 'fa-solid fa-cookie',
              soup: 'fa-solid fa-bowl-food',
              dietary: 'fa-solid fa-shield-heart',
              fat: 'fa-solid fa-bottle-droplet'
            };
            return (
              <span key={idx} className={tagClass}>
                <i className={iconMap[tag.type as keyof typeof iconMap]}></i> {tag.type}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;