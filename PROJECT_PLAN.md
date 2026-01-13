# План приложения "Конструктор форм"

## 1. Технический стек

- **React** 19
- **Zustand** - state management
- **Ant Design** - UI компоненты
- **React JSS** - стилизация
- **Webpack** - сборка (с нуля, dev-server, hot reload)
- **npm** - package manager
- **React Router** v6 - роутинг
- **uuid** - генерация ID
- **ESLint** - строгая конфигурация (typescript-eslint + airbnb + react-hooks)

---

## 2. Структура данных в Zustand

### Store Schema

```javascript
{
  // Формы
  forms: {
    [formId: string]: {
      id: string,
      название: string,
      системноеНазвание: string,
      groupIds: string[] // порядок важен для отображения
    }
  },

  // Группы полей
  groups: {
    [groupId: string]: {
      id: string,
      название: string,
      системноеНазвание: string,
      опубликовано: boolean,
      formId: string,
      fieldIds: string[], // порядок важен
      видимость: {} // заполним позже
    }
  },

  // Поля
  fields: {
    [fieldId: string]: {
      id: string,
      лейбл: string,
      name: string,
      системныйЛейбл: string,
      тип: 'input' | 'switch' | 'textarea' | 'select',
      groupId: string,

      // Специфичные свойства для каждого типа
      свойства: {
        // Для input
        placeholder?: string,
        inputType?: 'text' | 'number' | 'email',

        // Для select
        options?: Array<{label: string, value: string}>,
        multiple?: boolean,

        // Для textarea
        rows?: number,

        // Для switch
        defaultValue?: boolean
      },

      // Правила валидации
      валидация: {
        required?: boolean,
        minLength?: number,
        maxLength?: number,
        pattern?: string
      },

      зависимость: {} // заполним позже
    }
  }
}
```

### Actions в Zustand

```
// Forms
- createForm(название, системноеНазвание)
- updateForm(formId, данные)
- deleteForm(formId)

// Groups
- createGroup(formId, название, системноеНазвание, опубликовано)
- updateGroup(groupId, данные)
- deleteGroup(groupId)
- moveGroupUp(formId, groupId)
- moveGroupDown(formId, groupId)

// Fields
- createField(groupId, данные)
- updateField(fieldId, данные)
- deleteField(fieldId)
- moveFieldUp(groupId, fieldId)
- moveFieldDown(groupId, fieldId)
```

---

## 3. Справочник типов полей

Жестко зашитые объекты в коде:

```javascript
// Общие свойства для всех типов полей
COMMON_FIELD_PROPS = {
  лейбл: { type: 'string', label: 'Лейбл', required: true },
  name: { type: 'string', label: 'Name', required: true },
  системныйЛейбл: { type: 'string', label: 'Системный лейбл', required: false }
}

// Типы полей со специфичными свойствами
FIELD_TYPES = {
  input: {
    label: 'Input',
    specificProps: {
      placeholder: { type: 'string', label: 'Placeholder', required: false },
      inputType: { type: 'select', label: 'Тип', options: ['text', 'number', 'email'], default: 'text' }
    }
  },

  switch: {
    label: 'Switch',
    specificProps: {
      defaultValue: { type: 'boolean', label: 'Значение по умолчанию', default: false }
    }
  },

  textarea: {
    label: 'Textarea',
    specificProps: {
      placeholder: { type: 'string', label: 'Placeholder', required: false },
      rows: { type: 'number', label: 'Количество строк', default: 4 }
    }
  },

  select: {
    label: 'Select',
    specificProps: {
      options: { type: 'array', label: 'Опции', required: true },
      multiple: { type: 'boolean', label: 'Множественный выбор', default: false }
    }
  }
}
```

---

## 4. Структура проекта

```
/src
  /components
    /Layout
      - AppLayout.jsx          # Responsive layout из Antd
      - Header.jsx
      - Sidebar.jsx

    /Forms
      /FormsList
        - FormsListPage.jsx    # Страница со списком форм
        - FormsTable.jsx       # Таблица форм
        - CreateFormDrawer.jsx # Drawer создания формы

      /FormEdit
        - FormEditPage.jsx     # Страница редактирования формы
        - GroupTable.jsx       # Таблица группы с полями
        - GroupDrawer.jsx      # Drawer редактирования группы
        - FieldDrawer.jsx      # Drawer создания/редактирования поля

    /common
      - ConfirmModal.jsx       # Модалка подтверждения (для будущего)

  /store
    - useFormStore.js          # Zustand store
    - mockData.js              # Моковые данные для разработки

  /constants
    - fieldTypes.js            # Справочник типов полей

  /utils
    - validation.js            # Хелперы для валидации

  /styles
    - theme.js                 # Общие стили и переменные

  - App.jsx                    # Роуты
  - index.jsx                  # Entry point

/webpack
  - webpack.config.js
  - webpack.dev.js
  - webpack.prod.js

- package.json
- .eslintrc.js
```

---

## 5. Страницы и компоненты

### 5.1. Страница списка форм (`/forms`)

**Layout:**
- Заголовок страницы "Формы"
- Кнопка "Создать" (справа от заголовка)
- Таблица форм

**Таблица форм (Antd Table):**

Колонки:
- Название
- Системное название
- Действия (кнопка "Редактировать", кнопка "Удалить")

**Действия:**
- Клик на "Создать" → открывает CreateFormDrawer
- Клик на "Редактировать" → переход на `/forms/:formId`
- Клик на "Удалить" → удаление формы из store

---

### 5.2. Drawer создания формы

**Открывается:** справа, ширина 50%

**Заголовок:** "Создание формы"

**Поля (Antd Form):**
- Название (Input, required)
- Системное название (Input, optional)

**Footer:**
- Кнопка "Отмена" (закрывает drawer)
- Кнопка "Сохранить" (создает форму в store, закрывает drawer, переходит на `/forms/:formId`)

---

### 5.3. Страница редактирования формы (`/forms/:formId`)

**Layout:**
- Заголовок с названием формы
- Кнопка "Добавить группу" (под заголовком)
- Список групп (массив GroupTable компонентов)

**Действия:**
- Клик на "Добавить группу" → создает новую пустую группу, добавляет в конец списка

---

### 5.4. Компонент GroupTable

**Структура:** Antd Table с title и footer

**Title группы:**
```
[↑] [↓] | Название группы (системное_название) [иконка видимости если есть] [Удалить 🗑️] [Изменить ✏️]
```

Элементы:
- Кнопки вверх/вниз для изменения порядка группы
- Название группы
- Системное название (в скобках)
- Иконка видимости (отображается, если правила видимости заполнены)
- Кнопка "Удалить" (удаляет группу)
- Кнопка "Изменить" (открывает GroupDrawer)

**Таблица полей:**

Колонки:
- Лейбл
- Name
- Системный лейбл
- Тип (input/switch/textarea/select)
- Правила валидации (иконка ✓ если есть, ✗ если нет)
- Зависимость (иконка ✓ если есть, ✗ если нет)
- Действия ([↑] [↓] [Редактировать ✏️] [Удалить 🗑️])

**Footer группы:**
- Кнопка "Добавить поле" (открывает FieldDrawer в режиме создания)

---

### 5.5. Drawer редактирования группы (GroupDrawer)

**Открывается:** справа, ширина 50%

**Заголовок:** "Редактирование группы"

**Поля (Antd Form):**
- Название (Input, required)
- Системное название (Input, optional)
- Опубликовано (Switch)

**Разделитель**

**Секция "Видимость":**
- (пока пустая, заполним позже)

**Footer:**
- Кнопка "Отмена" (закрывает drawer без сохранения)
- Кнопка "Сохранить" (обновляет группу в store, закрывает drawer)

---

### 5.6. Drawer создания/редактирования поля (FieldDrawer)

**Открывается:** справа, ширина 50%

**Заголовок:** "Создание поля" / "Редактирование поля"

**Структура (Antd Form):**

**1. Выбор типа поля:**
- Тип поля (Select, options из FIELD_TYPES, required)

**2. Общие свойства (всегда видимы):**
- Лейбл (Input, required)
- Name (Input, required)
- Системный лейбл (Input, optional)

**3. Специфичные свойства (динамически меняются в зависимости от выбранного типа):**

Для **input**:
- Placeholder (Input)
- Тип (Select: text/number/email)

Для **switch**:
- Значение по умолчанию (Switch)

Для **textarea**:
- Placeholder (Input)
- Количество строк (InputNumber)

Для **select**:
- Опции (динамический список, можно добавлять/удалять пары label-value)
- Множественный выбор (Switch)

**4. Правила валидации (секция с заголовком):**
- Required (Switch)
- Минимальная длина (InputNumber, показывается только если required = true)
- Максимальная длина (InputNumber)
- Паттерн (Input для регулярного выражения)

**5. Зависимость:**
- (пока пустая, заполним позже)

**Footer:**
- Кнопка "Отмена" (закрывает drawer без сохранения)
- Кнопка "Сохранить" (создает/обновляет поле в store, закрывает drawer)

**Важно:** При изменении типа поля специфичные свойства сохраняются индивидуально для каждого типа (не стираются).

---

## 6. Роутинг

```
/forms              → FormsListPage
/forms/:formId      → FormEditPage
/*                  → Redirect на /forms
```

---

## 7. Моковые данные для разработки

При инициализации store создать:
- 2-3 формы
- В каждой форме по 1-2 группы
- В каждой группе по 2-3 поля разных типов
- Заполнить все свойства, валидацию и т.д.

---

## 8. ESLint конфигурация

Плагины:
- `@typescript-eslint/eslint-plugin`
- `eslint-config-airbnb`
- `eslint-plugin-react`
- `eslint-plugin-react-hooks`
- `eslint-plugin-jsx-a11y`
- `eslint-plugin-import`

Правила:
- Все правила Airbnb
- Строгие правила для hooks
- Запрет на any (если используем TypeScript)
- Обязательные PropTypes или TypeScript типы

---

## 9. Webpack конфигурация

**Основное:**
- Entry: `src/index.jsx`
- Output: `dist/bundle.js`
- Dev Server: порт 3000, hot reload
- Babel loader для React 19
- CSS/Style loaders для react-jss

**Плагины:**
- HtmlWebpackPlugin
- HotModuleReplacementPlugin

---

## 10. Этапы разработки (последовательность)

1. **Setup проекта**
   - Webpack конфигурация
   - ESLint
   - Базовая структура папок

2. **Layout и роутинг**
   - AppLayout с Antd Responsive Layout
   - React Router setup

3. **Zustand store**
   - Схема данных
   - Actions
   - Моковые данные

4. **Справочник типов полей**
   - Константы FIELD_TYPES

5. **Страница списка форм**
   - FormsListPage
   - FormsTable
   - CreateFormDrawer

6. **Страница редактирования формы**
   - FormEditPage
   - Кнопка "Добавить группу"

7. **Компонент группы**
   - GroupTable с title и footer
   - GroupDrawer

8. **Компонент поля**
   - FieldDrawer с динамическими полями

9. **Функционал перемещения**
   - Кнопки вверх/вниз для групп
   - Кнопки вверх/вниз для полей

10. **Полировка**
    - Стилизация с react-jss
    - Валидация форм
    - Обработка ошибок

---

## Отложенные функции (реализуем позже)

- Правила видимости групп
- Зависимости между полями
- Поиск/фильтрация на странице списка форм
- Модальные окна подтверждения удаления
- Интеграция с бэкендом
