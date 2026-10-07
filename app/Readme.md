# ASI / WARDROBE

Современный интерактивный fashion-сайт, созданный на **Next.js + React + TypeScript**.

Проект сочетает минималистичный fashion-дизайн, полноэкранный Hero-блок, видео-анимации, интерактивный переключатель состояний, каталог одежды, фильтрацию товаров и корзину.

---

## Содержание

- [О проекте](#о-проекте)
- [Технологии](#технологии)
- [Стиль дизайна](#стиль-дизайна)
- [Структура проекта](#структура-проекта)
- [Главный Hero](#главный-hero)
- [Как работает Hero-анимация](#как-работает-hero-анимация)
- [Система видео](#система-видео)
- [Интерактивные кнопки](#интерактивные-кнопки)
- [Capsule-анимация](#capsule-анимация)
- [Glass-эффект](#glass-эффект)
- [Состояния React](#состояния-react)
- [Система товаров](#система-товаров)
- [Корзина](#корзина)
- [localStorage](#localstorage)
- [Product Dialog](#product-dialog)
- [HeroCharacter](#herocharacter)
- [LtxHero](#ltxhero)
- [Почему некоторые компоненты не используются](#почему-некоторые-компоненты-не-используются)
- [Основные функции](#основные-функции)
- [Как добавить новый товар](#как-добавить-новый-товар)
- [Как добавить новую Hero-анимацию](#как-добавить-новую-hero-анимацию)
- [Запуск проекта](#запуск-проекта)

---

# О проекте

**ASI / WARDROBE** — это концептуальный интернет-магазин одежды с акцентом не только на каталог, но и на визуальное взаимодействие.

Главная идея проекта:

> Пользователь не просто смотрит сайт — он взаимодействует с визуальным контентом.

В Hero пользователь может выбирать разные состояния сцены.

При выборе кнопки:

1. текущая сцена меняется;
2. запускается соответствующее видео;
3. интерфейс плавно изменяет состояние;
4. остальные кнопки скрываются;
5. выбранная кнопка превращается в кнопку `Сбросить`;
6. после завершения видео пользователь может вернуться к исходному состоянию.

---

# Технологии

Проект использует:

- Next.js
- React
- TypeScript
- CSS
- HTML5 Video
- React Hooks
- localStorage
- `<dialog>`
- CSS transitions
- CSS variables
- `requestAnimationFrame`

---

# Стиль дизайна

Дизайн проекта можно описать как:

## Minimalist Editorial Fashion Design

или:

## Editorial Fashion / Digital Fashion

Основные характеристики:

- минимализм;
- большие типографические элементы;
- много свободного пространства;
- нейтральные цвета;
- крупные изображения;
- editorial-композиция;
- плавные анимации;
- glassmorphism-элементы;
- интерактивный Hero;
- асимметричные композиции;
- акцент на фотографии и видео.

Также используется принцип:

> Less UI — More Visual Experience

То есть интерфейс старается не перегружать пользователя большим количеством элементов.

---

# Структура проекта

Основная логика находится в:

```text
app/
└── page.tsx
```

Глобальные стили:

```text
app/
└── globals.css
```

Дополнительные компоненты могут находиться в:

```text
components/
```

Например:

```text
components/
├── HeroCharacter.tsx
└── LtxHero.tsx
```

Однако эти компоненты не обязательно используются текущей страницей.

---

# Главный Hero

Главный Hero находится непосредственно внутри:

```tsx
function Hero() {
```

Он является первой и самой интерактивной частью сайта.

Hero занимает практически весь экран:

```text
┌──────────────────────────────────────┐
│                                      │
│              THE WORLD MODEL         │
│                                      │
│        видео / визуальная сцена      │
│                                      │
│             [ Сцена ]                │
│       [Свет] [Одежда] [Коллекция]   │
│                                      │
└──────────────────────────────────────┘
```

---

# Система видео

Hero использует 8 видео:

```tsx
const CLIPS = [
  "video-1.mp4",
  "video-1-reverse.mp4",

  "video-2.mp4",
  "video-2-reverse.mp4",

  "video-3.mp4",
  "video-3-reverse.mp4",

  "video-4.mp4",
  "video-4-reverse.mp4",
];
```

Для каждого состояния существует две версии:

```text
обычное видео
reverse-видео
```

Например:

```text
video-1.mp4
video-1-reverse.mp4
```

Первое видео переводит Hero из начального состояния в выбранное.

Reverse возвращает его обратно.

---

# Почему используется 8 видео

У нас 4 варианта состояния:

```text
Сцена
Игра света
Одежда
Коллекция
```

Для каждого:

```text
Forward + Reverse
```

Получаем:

```text
4 × 2 = 8 видео
```

Схема:

```text
                 HERO
                  │
        ┌─────────┼─────────┐
        │         │         │
      Сцена      Свет     Одежда
        │         │         │
     + reverse + reverse + reverse
                  │
             Коллекция
                  │
              + reverse
```

---

# OPTIONS

Настройки Hero находятся здесь:

```tsx
const OPTIONS = [
  { key: "scene", label: "Сцена", file: 2 },
  { key: "light", label: "Ишаqlandırma", file: 3 },
  { key: "colorway", label: "Geyim", file: 1 },
  { key: "fullLook", label: "Kolleksiya", file: 4 },
];
```

Каждый объект содержит:

### key

Уникальное имя состояния.

Например:

```tsx
key: "scene"
```

### label

Текст кнопки:

```tsx
label: "Səhnə"
```

### file

Номер пары видео:

```tsx
file: 2
```

Он используется для вычисления позиции видео в массиве.

---

# Как выбирается видео

Главная формула:

```tsx
const clipIndex =
  (option.file - 1) * 2 + (reverse ? 1 : 0);
```

Например:

```text
file = 1
```

получаем:

```text
0 → обычное видео
1 → reverse
```

Для:

```text
file = 2
```

получаем:

```text
2 → обычное видео
3 → reverse
```

Для:

```text
file = 3
```

получаем:

```text
4 → обычное видео
5 → reverse
```

Для:

```text
file = 4
```

получаем:

```text
6 → обычное видео
7 → reverse
```

---

# Как работает Hero-анимация

Основная функция:

```tsx
function start(index: number, reverse: boolean)
```

Она отвечает за запуск анимации.

Когда пользователь нажимает кнопку:

```text
Пользователь
     ↓
click
     ↓
start()
     ↓
выбор видео
     ↓
изменение состояния React
     ↓
показывается нужное видео
     ↓
video.play()
     ↓
сцена меняется
```

---

# reveal()

Функция:

```tsx
const reveal = useCallback((index: number) => {
```

отвечает за отображение нужного видео.

Она проходит по всем видео:

```tsx
videos.current.forEach((video, i) => {
```

и делает:

```tsx
video.style.visibility =
  i === index ? "visible" : "hidden";
```

То есть одновременно визуально показывается только одно видео.

Например:

```text
Видео 0 → hidden
Видео 1 → hidden
Видео 2 → VISIBLE
Видео 3 → hidden
Видео 4 → hidden
...
```

---

# Почему видео не удаляются из DOM

Мы не создаём и не удаляем `<video>` каждый раз.

Все видео существуют одновременно:

```tsx
{CLIPS.map((clip, index) => (
  <video ... />
))}
```

Но большинство из них:

```css
visibility: hidden;
```

Это позволяет быстрее переключаться между состояниями.

---

# useRef для видео

Используется:

```tsx
const videos = useRef<(HTMLVideoElement | null)[]>([]);
```

Каждое видео сохраняется в массив:

```tsx
videos.current[index] = element;
```

Теперь можно обратиться непосредственно к DOM-элементу:

```tsx
videos.current[2]
```

и сделать:

```tsx
video.play();
video.pause();
video.currentTime = 0;
```

---

# Автоматическая загрузка видео

Используется:

```tsx
loadeddata
```

и:

```tsx
canplay
```

Когда браузер понимает, что видео готово:

```tsx
setReady(...)
```

обновляет состояние.

Это позволяет не запускать видео, которое ещё не загрузилось.

---

# ready

Состояние:

```tsx
const [ready, setReady] = useState<boolean[]>(
  Array(8).fill(false),
);
```

Создаёт:

```text
[false, false, false, false, false, false, false, false]
```

После загрузки видео:

```text
[true, true, false, false, ...]
```

Кнопка становится доступной только когда необходимые видео готовы.

---

# selected

```tsx
const [selected, setSelected] =
  useState<number | null>(null);
```

Хранит выбранное состояние.

Например:

```text
null
```

означает:

> Ничего не выбрано.

Если:

```text
selected = 2
```

значит выбрана третья кнопка.

---

# collapsed

```tsx
const [collapsed, setCollapsed] =
  useState(false);
```

Отвечает за сворачивание контроллера.

До выбора:

```text
[ Сцена ][ Свет ][ Одежда ][ Коллекция ]
```

После выбора:

```text
                  [ Сбросить ]
```

---

# titleHidden

```tsx
const [titleHidden, setTitleHidden] =
  useState(false);
```

Используется для скрытия/изменения состояния большого Hero-заголовка.

При выборе:

```tsx
setTitleHidden(true);
```

После сброса:

```tsx
setTitleHidden(false);
```

CSS уже решает, каким именно образом заголовок исчезает.

---

# Capsule-анимация

Одна из главных визуальных деталей Hero — движущаяся capsule.

Она находится здесь:

```tsx
<div className="capsule glass" />
```

Это визуальный элемент, который перемещается под выбранную область.

---

# capsule()

Функция:

```tsx
function capsule(index: number)
```

изменяет:

```css
--cap-left
```

и:

```css
--cap-width
```

Например:

```tsx
element.style.setProperty(
  "--cap-left",
  `${index * 20}%`,
);
```

Таким образом CSS-позиция capsule меняется без необходимости создавать новый DOM-элемент.

---

# Почему используется CSS Variable

Вместо:

```tsx
element.style.left = ...
```

используется:

```tsx
--cap-left
```

Преимущество:

CSS может использовать эту переменную в transition:

```css
transform:
  translateX(var(--cap-left));
```

и плавно анимировать изменение.

---

# Наведение мыши

Когда пользователь наводит мышь:

```tsx
onPointerEnter={() =>
  capsule(index + 1)
}
```

capsule перемещается к соответствующей кнопке.

Когда мышь уходит:

```tsx
onPointerLeave={() => {
  capsule(0);
}}
```

она возвращается в начальное положение.

---

# Glass Effect

Контроллер использует:

```tsx
className="track glass"
```

и:

```tsx
className="capsule glass"
```

Это создаёт эффект:

## Glassmorphism

Основные признаки:

- прозрачность;
- blur;
- полупрозрачный фон;
- светлая граница;
- отражение;
- мягкие переходы.

---

# Mouse-following Glass Effect

При движении мыши:

```tsx
onPointerMove={(event) => {
```

вычисляется положение курсора относительно контроллера:

```tsx
(event.clientX - rect.left) / rect.width
```

и:

```tsx
(event.clientY - rect.top) / rect.height
```

После этого обновляются:

```css
--glass-x
--glass-y
```

CSS может использовать эти значения для создания эффекта отражения/свечения.

---

# measureTravel()

Функция:

```tsx
function measureTravel(index: number)
```

вычисляет расстояние между:

```text
контроллером
```

и:

```text
конкретной кнопкой
```

После этого записывает:

```css
--travel-x
--travel-y
```

Это используется для анимационного перемещения выбранной кнопки.

---

# Сценарий нажатия

Полный процесс выглядит так:

```text
Пользователь наводит мышь
        ↓
capsule()
        ↓
capsule перемещается
        ↓
Пользователь нажимает
        ↓
start()
        ↓
measureTravel()
        ↓
selected = index
        ↓
collapsed = true
        ↓
titleHidden = true
        ↓
остальные кнопки скрываются
        ↓
выбирается нужное видео
        ↓
остальные видео pause()
        ↓
currentTime = 0
        ↓
reveal()
        ↓
video.play()
        ↓
Hero-анимация
        ↓
video.onended
        ↓
состояние сохраняется
```

---

# Reverse-анимация

Если пользователь нажимает на выбранную кнопку ещё раз:

```tsx
start(index, selected === index)
```

`reverse` становится:

```text
true
```

После этого запускается:

```text
reverse video
```

Например:

```text
video-2.mp4
        ↓
выбранное состояние

video-2-reverse.mp4
        ↓
возврат
```

---

# video.onended

После окончания видео:

```tsx
video.onended = () => {
```

Если это обычная анимация:

```tsx
setSelected(index);
```

Состояние остаётся выбранным.

Если reverse:

```tsx
reveal(0);
setSelected(null);
setCollapsed(false);
setTitleHidden(false);
```

Hero возвращается в исходное состояние.

---

# Каталог

После Hero начинается магазин.

Основные товары находятся в:

```tsx
const PRODUCTS = [...]
```

Каждый товар содержит:

```text
id
name
category
price
group
description
image
```

Например:

```tsx
{
  id: "shirt",
  name: "Rahat kəsimli köynək",
  category: "Pambıq / süd rəngi",
  price: 7900,
  group: "Üst geyim",
  description: "...",
  image: "..."
}
```

---

# Фильтрация

Фильтр:

```tsx
const [filter, setFilter] =
  useState("Hamısı");
```

Когда пользователь выбирает категорию:

```tsx
setFilter(item)
```

товары фильтруются:

```tsx
PRODUCTS.filter(
  (product) =>
    filter === "Hamısı" ||
    product.group === filter,
)
```

Таким образом можно показать:

```text
Hamısı
Üst geyim
Alt geyim
Trikotaj
```

---

# Выбор размера

Для каждого товара используется:

```tsx
const [sizes, setSizes] =
  useState<Record<string, string>>({});
```

Например:

```text
shirt → M
denim → L
tshirt → S
```

Размер сохраняется по `product.id`.

---

# Добавление в корзину

Главная функция:

```tsx
function add(product: Product)
```

Сначала определяется размер:

```tsx
const size = sizes[product.id] || "M";
```

Если пользователь не выбрал размер:

```text
M
```

становится размером по умолчанию.

---

# Проверка существующего товара

Проверяется:

```tsx
cart.find(
  (line) =>
    line.product.id === product.id &&
    line.size === size,
)
```

Если такой товар уже есть:

```text
количество +1
```

Если нет:

```text
создаётся новая позиция
```

---

# Система корзины

Корзина хранится в:

```tsx
const [cart, setCart] =
  useState<Line[]>([]);
```

Одна строка корзины:

```tsx
type Line = {
  product: Product;
  size: string;
  quantity: number;
};
```

Например:

```text
Футболка
M
2 шт.
```

---

# Подсчёт количества

Используется:

```tsx
const count = cart.reduce(
  (sum, line) => sum + line.quantity,
  0,
);
```

Если:

```text
Футболка × 2
Джинсы × 1
```

получаем:

```text
3
```

---

# Подсчёт цены

Используется:

```tsx
const total = cart.reduce(
  (sum, line) =>
    sum + line.product.price * line.quantity,
  0,
);
```

То есть:

```text
цена × количество
```

для каждой позиции.

---

# localStorage

Корзина сохраняется в браузере:

```tsx
localStorage.setItem(
  "asi-bag",
  JSON.stringify(next),
);
```

Используется ключ:

```text
asi-bag
```

Поэтому после обновления страницы корзина не должна исчезать.

При загрузке сайта:

```tsx
localStorage.getItem("asi-bag")
```

получает сохранённые данные.

---

# Product Dialog

При клике на товар вызывается:

```tsx
openProduct(product)
```

После этого:

```tsx
setSelectedProduct(product)
```

и открывается:

```html
<dialog>
```

Внутри отображаются:

- фотография;
- название;
- категория;
- цена;
- описание;
- размеры;
- кнопка добавления в корзину.

---

# Почему используется dialog

HTML `<dialog>` позволяет сделать отдельное модальное окно без создания сложной системы вручную.

Открытие:

```tsx
productDialog.current?.showModal();
```

Закрытие:

```tsx
productDialog.current?.close();
```

---

# Cart Dialog

Корзина также использует:

```html
<dialog>
```

Когда:

```tsx
cartOpen === true
```

вызывается:

```tsx
dialog.current?.showModal();
```

Когда:

```tsx
cartOpen === false
```

вызывается:

```tsx
dialog.current?.close();
```

---

# HeroCharacter.tsx

В проекте также существует отдельный компонент:

```text
HeroCharacter.tsx
```

Он работает по другой концепции.

Внутри есть два слоя:

```text
обычный персонаж
        +
персонаж с эффектом
```

Основной слой:

```tsx
hero-character-base
```

и слой эффекта:

```tsx
hero-character-reveal
```

---

# Как работает HeroCharacter

Компонент отслеживает мышь:

```tsx
window.addEventListener(
  "mousemove",
  handleMouseMove
);
```

Положение курсора сохраняется:

```tsx
mouseX
mouseY
```

Затем координаты сглаживаются:

```tsx
smoothX +=
  (mouseX - smoothX) * 0.1;
```

и:

```tsx
smoothY +=
  (mouseY - smoothY) * 0.1;
```

Получается плавное движение вместо резкого следования за курсором.

---

# requestAnimationFrame

HeroCharacter использует:

```tsx
requestAnimationFrame(update);
```

Это браузерный механизм для плавной анимации.

Вместо постоянного изменения DOM:

```text
каждый кадр браузера
        ↓
update()
        ↓
новые координаты
        ↓
CSS variables
        ↓
визуальный эффект
```

При удалении компонента выполняется:

```tsx
cancelAnimationFrame(animationFrame);
```

Это предотвращает утечки анимации.

---

# LtxHero.tsx

В проекте также есть:

```text
LtxHero.tsx
```

Это отдельная версия Hero.

Она содержит:

- fullscreen video;
- navbar;
- LTX-логотип;
- большие слова `wear / your / way`;
- дополнительную информацию;
- CTA-кнопку.

Однако это **отдельный компонент**, не тот Hero, который сейчас используется в основном `page.tsx`.

Если в проекте нет:

```tsx
import LtxHero from "...";
```

и:

```tsx
<LtxHero />
```

то компонент не отображается.

---

# Почему LtxHero может остаться в проекте

Файл может быть старым экспериментом или предыдущей версией дизайна.

React-компонент сам по себе не появляется на странице.

Он должен быть подключён:

```tsx
import LtxHero from "./LtxHero";
```

и использован:

```tsx
<LtxHero />
```

Поэтому перед удалением старых файлов нужно проверить импорты.

---

# Архитектура проекта

Упрощённо текущая архитектура выглядит так:

```text
Next.js
│
├── app
│   ├── page.tsx
│   │
│   └── globals.css
│
├── components
│   ├── HeroCharacter.tsx
│   └── LtxHero.tsx
│
└── public
```

Главный поток:

```text
page.tsx
   │
   ├── Hero
   │    ├── Video
   │    ├── Controller
   │    ├── Capsule
   │    └── Hero animation
   │
   ├── Collection
   │    ├── Filters
   │    ├── Products
   │    └── Product Dialog
   │
   ├── Editorial
   │
   ├── About
   │
   ├── Footer
   │
   └── Cart Dialog
```

---

# Основные React Hooks

## useState

Используется для состояния интерфейса.

Например:

```tsx
const [selected, setSelected] =
  useState<number | null>(null);
```

Когда состояние изменяется:

```tsx
setSelected(2);
```

React перерисовывает необходимую часть интерфейса.

---

## useRef

Используется для хранения DOM-элементов.

Например:

```tsx
const controller =
  useRef<HTMLDivElement>(null);
```

Можно получить:

```tsx
controller.current
```

и напрямую изменить DOM.

---

## useEffect

Используется для действий после рендера.

Например:

- загрузка видео;
- чтение localStorage;
- открытие dialog;
- закрытие dialog;
- добавление event listener.

---

## useCallback

Используется для функции:

```tsx
reveal()
```

чтобы сохранить стабильную ссылку на функцию между рендерами.

---

# Почему в проекте много CSS Variables

CSS Variables позволяют React передавать значения в CSS:

```tsx
element.style.setProperty(
  "--cap-left",
  "40%",
);
```

А CSS уже отвечает за визуальную анимацию.

Это хорошее разделение:

```text
React
 ↓
логика
 ↓
CSS variables
 ↓
CSS
 ↓
анимация
```

---

# Главный принцип анимаций проекта

Проект не пытается делать абсолютно всё через React.

React отвечает за:

```text
что должно произойти
```

CSS отвечает за:

```text
как это должно выглядеть
```

Видео отвечает за:

```text
сложную визуальную трансформацию
```

Получается:

```text
React
   ↓
состояние
   ↓
выбор видео
   ↓
CSS transition
   ↓
видео
   ↓
готовая визуальная сцена
```

---

# Как добавить новый товар

Добавить объект в:

```tsx
const PRODUCTS = [...]
```

Например:

```tsx
{
  id: "hoodie",
  name: "Oversize hoodie",
  category: "Pambıq / boz",
  price: 12900,
  group: "Üst geyim",
  description: "Rahat gündəlik hoodie.",
  image: "URL_ИЗОБРАЖЕНИЯ",
}
```

Важно:

`id` должен быть уникальным.

Не нужно использовать старые визуальные номера вроде:

```text
01
02
03
04
```

если они должны быть видны пользователю.

---

# Как добавить новую Hero-анимацию

Если необходимо добавить новое состояние:

### 1. Добавить новую кнопку

В:

```tsx
OPTIONS
```

например:

```tsx
{
  key: "background",
  label: "Arxa fon",
  file: 5,
}
```

### 2. Добавить два видео

```text
video-5.mp4
video-5-reverse.mp4
```

### 3. Добавить их в CLIPS

```tsx
const CLIPS = [
  ...
  "video-5.mp4",
  "video-5-reverse.mp4",
];
```

### 4. Система автоматически вычислит индекс

Формула:

```tsx
(option.file - 1) * 2
```

будет использовать новую пару.

---

# Важное правило при работе с проектом

Не нужно менять архитектуру ради небольших изменений.

Если нужно изменить:

```text
текст
```

меняем текст.

Если нужно изменить:

```text
логотип
```

меняем `Logo()`.

Если нужно изменить:

```text
анимацию
```

меняем соответствующую функцию или CSS.

Если нужно изменить:

```text
товар
```

меняем `PRODUCTS`.

Не нужно переписывать весь `page.tsx`.

---

# Запуск проекта

Установить зависимости:

```bash
npm install
```

Запустить development server:

```bash
npm run dev
```

После запуска открыть:

```text
http://localhost:3000
```

---

# Production build

Проверка production-сборки:

```bash
npm run build
```

Запуск production:

```bash
npm start
```

---

# Итог

ASI / WARDROBE построен вокруг нескольких основных идей:

```text
                 ASI / WARDROBE
                        │
          ┌─────────────┴─────────────┐
          │                           │
       VISUAL                      SHOP
          │                           │
       Hero                       Products
          │                           │
       Videos                      Filters
          │                           │
       Capsule                     Sizes
          │                           │
       Glass                       Cart
          │                           │
       Reverse                    Dialog
          │
     React State
          │
       CSS Motion
```

Главная особенность проекта — **Hero не является обычным баннером**.

Он работает как интерактивная визуальная сцена:

```text
Наведение
   ↓
Capsule movement
   ↓
Нажатие
   ↓
React state
   ↓
Video selection
   ↓
Forward animation
   ↓
Новое состояние
   ↓
Reverse animation
   ↓
Возврат
```

Таким образом сайт сочетает **editorial fashion design + cinematic video transitions + interactive UI + e-commerce functionality**.

Это делает проект не просто интернет-магазином, а интерактивным digital-fashion experience.