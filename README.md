# Конструктор форм

Приложение для создания и управления формами с поддержкой различных типов полей, валидации и динамических свойств.

## Технологический стек

- **React 19** - UI библиотека
- **TypeScript 5.7** - типизация
- **Zustand 5** - управление состоянием
- **Ant Design 5** - UI компоненты
- **React Router v6** - роутинг
- **React JSS** - стилизация
- **Webpack 5** - сборка
- **Babel + React Compiler** - компиляция с автоматической оптимизацией React компонентов
- **ESLint (Airbnb)** - линтинг с поддержкой TypeScript

## Особенности

### TypeScript
- Полная типизация всех компонентов, хуков и функций
- Строгий режим TypeScript
- Интерфейсы для всех данных (Form, Group, Field)
- Type-safe Zustand store

### React Compiler
React Compiler (babel-plugin-react-compiler) автоматически оптимизирует компоненты:
- Автоматическая мемоизация компонентов
- Оптимизация ре-рендеров
- Улучшенная производительность без ручного использования `useMemo`/`useCallback`

### Архитектура данных
Нормализованная структура данных для эффективного управления:
```typescript
{
  forms: { [formId]: Form },
  groups: { [groupId]: Group },
  fields: { [fieldId]: Field }
}
```

## Команды

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера (http://localhost:3000)
npm run dev

# Production сборка
npm run build

# Линтинг
npm run lint

# Проверка типов
npm run type-check
```

## Структура проекта

```
src/
├── types/              # TypeScript типы
│   └── index.ts
├── store/              # Zustand store
│   ├── useFormStore.ts
│   └── mockData.ts
├── constants/          # Константы и справочники
│   └── fieldTypes.ts
├── components/
│   ├── Layout/        # Layout компоненты
│   │   └── AppLayout.tsx
│   └── Forms/
│       ├── FormsList/ # Список форм
│       │   ├── FormsListPage.tsx
│       │   ├── FormsTable.tsx
│       │   └── CreateFormDrawer.tsx
│       └── FormEdit/  # Редактирование формы
│           ├── FormEditPage.tsx
│           ├── GroupTable.tsx
│           ├── GroupDrawer.tsx
│           └── FieldDrawer.tsx
├── App.tsx
└── index.tsx
```

## Функциональность

### Управление формами
- Создание/редактирование/удаление форм
- Список всех форм в табличном виде

### Управление группами полей
- Добавление групп в форму
- Редактирование групп (название, системное название, публикация)
- Изменение порядка групп (кнопки вверх/вниз)
- Удаление групп

### Управление полями
- Поддержка 4 типов полей:
  - Input (text, number, email)
  - Switch
  - Textarea
  - Select (с множественным выбором)
- Динамические свойства в зависимости от типа поля
- Правила валидации:
  - Обязательность
  - Минимальная/максимальная длина
  - Регулярные выражения
- Изменение порядка полей (кнопки вверх/вниз)
- Удаление полей

## Конфигурация

### TypeScript (tsconfig.json)
- Target: ES2020
- Strict mode включен
- Module resolution: bundler
- JSX: react-jsx (автоматический импорт React)

### React Compiler
Настроен в webpack.config.js:
```javascript
{
  loader: 'babel-loader',
  options: {
    plugins: [
      ['babel-plugin-react-compiler', { target: '19' }]
    ]
  }
}
```

### ESLint
- Airbnb style guide
- TypeScript поддержка
- React hooks правила
- Автоматическая проверка импортов

## Разработка

Приложение использует hot module replacement для быстрой разработки. Все изменения применяются автоматически без перезагрузки страницы.

## Будущие улучшения

- Правила видимости групп
- Зависимости между полями
- Поиск и фильтрация форм
- Экспорт/импорт форм
- Интеграция с backend API
