# Промпты под сайт AI.CREA.IT

Промпты на английском (модели понимают его точнее), комментарии на русском.
Каждый блок подписан: **какой слот, какой файл, какой размер**. Копируешь блок целиком — дописывать ничего не нужно.

> Этот файл переписан 1 сентября 2026 под новую геометрию сайта. Старая версия (где у услуг стоял формат 4:5) больше не действует — именно из-за неё половина кадров резалась.

---

## 1. Размеры — самое важное

На сайте два типа мест, и путать их нельзя.

### Полноэкранные секции — **два файла на слот**

Первый экран, «Chi siamo», пять услуг, шапки Lavori и Brief, флагманский кейс.
Браузер сам выбирает нужный файл: широкий на компьютере, вертикальный на телефоне.

| | Соотношение | Итоговый размер | Генерируй не меньше |
|---|---|---|---|
| Десктоп | **16:9** | 1440 × 810 | 2560 × 1440 |
| Мобильный | **3:4** | 860 × 1147 | 1536 × 2048 |

### Фиксированные места — **один файл**

| Место | Соотношение | Итоговый размер | Генерируй не меньше |
|---|---|---|---|
| Галерея «Stile» и альбом «Lavori» | **3:4** | 760 × 1013 | 1536 × 2048 |
| Тизер ниш на главной | **1:1** | 700 × 700 | 2048 × 2048 |
| Кадр рядом с цифрами | **4:5** | 880 × 1100 | 1638 × 2048 |

### Видео

| Что | Соотношение | Размер | Длина |
|---|---|---|---|
| Hero-луп на первом экране | 16:9 | 1920 × 1080 | 8–10 сек, без звука |
| Showreel | 16:9 | 1920 × 1080 | 45–60 сек, со звуком |
| Реелы в портфолио | 9:16 | 1080 × 1920 | 4–15 сек, без звука |

**Не подгоняй размер сама** — генерируй крупно, а обрезку сделает редактор `admin.html`: он выдаст файл уже с правильным именем и в правильных пикселях.

---

## 2. Как получить два формата одного кадра

Проблема: если сгенерировать один и тот же промпт в 16:9 и в 3:4, получатся **два разных снимка**. На сайте это будет выглядеть так, будто на компьютере одна фотография, а на телефоне другая.

Правильный порядок:

1. Генерируешь кадр в **16:9** — это главный формат.
2. Берёшь готовый кадр и **расширяешь его вверх и вниз** до 3:4 через reframe / outpaint. В Higgsfield это инструмент **Reframe**, в Krea — **Enhance / Uncrop**. Модель дорисует недостающее сверху и снизу, сохранив тот же снимок.
3. Оба файла кидаешь в `admin.html`, вкладки «Десктоп» и «Мобильный», скачиваешь.

Если reframe недоступен — сгенерируй 3:4 тем же промптом, добавив в конец `Vertical 3:4 composition, same scene, same lighting, subject centred with headroom above and below.` Совпадёт не идеально, но будет из одной серии.

---

## 3. ДНК бренда — добавляй в конец каждого промпта

Это то, что делает кадр «нашим». Без этого блока модель уходит в глянцевый сток или в CGI.

```
Photographic realism of a luxury magazine editorial — not a 3D render, not CGI, not an illustration, not an AI-looking image, not over-retouched. Colour palette strictly limited to: near-black #1C1B18 shadows, eucalyptus white #F2F5F3 highlights, deep jungle emerald #1F4D3A, and exactly one warm accent — antique gold #C9A227 — used sparingly. Low-key cinematic lighting, deep falloff into shadow, one light source dominant. Natural skin and material texture, visible pores and fibres, fine 35mm film grain, shallow depth of field. Absolutely no text, no lettering, no label, no signage, no logo, no watermark, no numbers anywhere in the frame. Correct anatomy: five fingers on every visible hand, natural animal anatomy.
```

Три правила бренда, которые в этом блоке зашиты, — не убирай их:

1. **Не CGI.** Если кадр читается как рендер — брак.
2. **Один тёплый акцент.** Золото **или** бордо, не оба сразу.
3. **Никакого текста в кадре.** Именно так испортилась целая партия видео в августе: модель впечатала «IL TUO BRAND» в ролик.

---

## 4. Чего не хватает прямо сейчас — 3 позиции

### ⬛ Слот 01 · Hero-видео · `video/hero.mp4` · 16:9, 1920×1080

Самый важный кадр сайта. Медленный, без резких движений — он крутится в петле под крупным заголовком. Заголовок ложится **слева снизу**, значит главное держи справа или по центру.

**Шаг 1 — первый кадр как фото (16:9):**

```
Cinematic editorial still life: a dark faceted perfume bottle standing on wet black volcanic stone, positioned in the right third of the frame. A single amber drop clings to the glass shoulder. Deep emerald tropical monstera leaves dissolve into darkness behind it. One narrow shaft of low warm side light rakes across the glass from the right. The entire left half of the frame is empty deep shadow. Faint volumetric haze. Shot on 85mm, f/1.8.
```
+ блок ДНК бренда

**Шаг 2 — оживляешь этот кадр (image-to-video):**

```
Animate this image as a slow 8-second seamless loop. The camera performs an extremely slow push-in, no more than 5% zoom across the whole clip. The amber drop swells and runs slowly down the glass. Faint haze drifts left to right behind the bottle. Emerald leaves breathe with a barely perceptible sway. Nothing else moves. No cuts, no camera shake, no lens flare, no added text or graphics. The final frame must match the opening frame so the loop is invisible. Silent.
```

Экспорт: H.264, 1920×1080, битрейт 3–4 Мбит/с, без звука. Тяжелее — первый экран будет грузиться вечно.

---

### ⬛ Слот 07 · Студия · `studio.jpg` + `studio-mobile.jpg` · 16:9 и 3:4

Секция называется «Nessun set. Nessuna attesa» — «ни съёмочной площадки, ни ожидания». Значит кадр не про камеры и софтбоксы, а про тихую работу одного человека ночью. Текст ложится **слева**.

```
Cinematic wide interior of a minimal creative workspace at night. A large monitor glows on a dark walnut desk, its screen turned away from camera so nothing on it is readable. A woman with dark hair sits in silhouette at the desk, seen from behind and slightly to the side, one hand resting near a graphics tablet. She occupies the right third of the frame. A single warm desk lamp pools antique gold light onto the wood. Everything else falls to near-black. One tall monstera plant catches the edge of the light at the right edge. Warm haze in the air. The left half of the frame is empty dark space. Shot on 35mm, f/2.8.
```
+ блок ДНК бренда

---

### ⬛ Слот 06 · Пять этапов метода · `metodo-01…05.jpg` · 4:5, 880×1100

Кадры сменяются по мере прокрутки. Они обязаны читаться **как одна серия**: тот же стол, тот же свет, меняется только предмет. Сгенерируй первый, потом используй его как референс стиля для остальных четырёх — в Midjourney это `--sref`, в Higgsfield/Krea поле style reference.

Общее начало для всех пяти:

```
Overhead flat lay on a dark walnut desk, warm directional light from the upper left, long soft shadows falling to the lower right, near-black surface, eucalyptus white paper, one antique gold highlight. Shot on 50mm from directly above, f/4.
```

Дальше подставляешь предмет:

**01 — Brief:** `An open notebook with completely blank pages, a fine black pen resting in the fold, a cup of espresso, folded glasses, a sprig of eucalyptus.`

**02 — Concept:** `A loose spread of printed photographs showing only abstract colour fields and textures, a fan of paint swatches in emerald and cream tones, a square of black velvet.`

**03 — Generazione:** `A graphics tablet with a stylus resting on it, the tablet surface dark and empty, beside a stack of contact-sheet prints showing rows of tiny abstract tonal squares.`

**04 — Post-produzione:** `A colour calibration card with plain colour patches only, a loupe magnifier, a single large print showing a soft abstract gradient, folded white cotton handling gloves.`

**05 — Consegna:** `A slim eucalyptus-white portfolio box with the lid slightly ajar, finished prints inside tied with a thin emerald ribbon, a sprig of eucalyptus laid across the lid.`

И в конец каждого — блок ДНК бренда. В нём уже запрещён любой текст, а это здесь критично: блокноты, карточки и коробки модели обожают подписывать бессмысленными буквами.

---

## 5. Полноэкранные кадры — если захочешь пересобрать

Сейчас в них стоят твои существующие снимки. Эти промпты — если решишь снять специально под композицию сайта.

Везде: **два файла**, 16:9 и 3:4, и всегда добавляется блок ДНК бренда.

### Слот 02 · «Chi siamo» · `about-bg.jpg`
Текстовая панель занимает **левую половину**. Ты — справа.

```
Vertical-format editorial portrait of a woman in her early thirties with dark hair, standing in a dim studio, positioned in the right third of the frame. Structured black leather jacket over an emerald silk shirt, minimal jewellery, light natural makeup. Turned slightly away, looking back over her shoulder directly into the lens, calm and unsmiling. Behind her one large circle of deep jungle emerald light on a near-black wall. Strong low-key light from the right, the entire left half of the frame in deep empty shadow. One warm gold rim light on her jawline. Shot on 50mm, f/2.
```

⚠ **Прикрепи референс своего лица**, иначе получится другой человек. Midjourney — `--cref <ссылка> --cw 80`. Higgsfield / Krea — поле character reference.

### Слот 11 · Флагманский кейс · `caso.jpg`
Заголовок и четыре цифры лежат **внизу слева**. Лицо держи выше центра и правее.

```
Cinematic editorial photograph: a woman in a floor-length black velvet gown standing on a dark marble floor, framed from the knees up, positioned right of centre with her face in the upper third. One hand lowered towards a black panther sitting calmly beside her, its shoulder at her hip. Deep bordeaux velvet drapery fills the background, lit from a single high source so the folds fall into darkness. Antique gold jewellery — one wide cuff, one fine chain — catches the light. Composed expression, direct gaze. The lower left quadrant is empty deep shadow. Shot on 85mm, f/2.2.
```

### Слот 12 · Шапка «Lavori» · `lavori-hero.jpg`
Слово LAVORI лежит **внизу слева**, крупно.

```
Cinematic full-length editorial: a woman in a black gown with a long train standing in a deep bordeaux studio space, a black panther standing at her side, both in the right half of the frame. Single hard light from the upper right, everything left of the subject falling to near-black. Her face in the upper third of the frame. Shot on 85mm, f/2.5.
```

### Слот 15 · Шапка «Brief» · `brief-hero.jpg`
Страница анкеты — кадр должен быть мягче остальных, приглашающим.

```
Editorial photograph in soft morning mist: a woman in a sage-green tulle gown standing in a wide misty meadow, a white snowy owl in flight approaching her outstretched arm. She stands in the right half of the frame, small against the landscape. Cool desaturated greens, one warm gold band of light low on the horizon. Everything soft, quiet, airy. Shot on 85mm, f/2.8.
```

### Слоты 08·1–08·5 · Пять услуг · `servizio-01…05.jpg`
У всех пяти текст лежит **слева**, поверх затемнения. Объект — справа.

**01 · Fotografia di prodotto**
```
Extreme close-up of a glass pipette suspended above an amber apothecary bottle, one golden drop about to fall into still water below, ripples spreading. Wet emerald leaves frame the right side. Warm side light from the right, deep shadow filling the left half. Shot on 100mm macro, f/2.8.
```

**02 · Video e pubblicità**
```
Cinematic close-up of a dark perfume bottle on black stone, caught inside a moving light: one hard beam of warm gold sweeping diagonally across the glass, half the bottle brilliantly lit, the other half falling to near-black. Fine atmospheric haze reveals the shape of the beam. The subject sits in the right half, the left half is empty darkness. Shot on 85mm, f/2.
```

**03 · Volti del brand**
```
Editorial portrait of a woman in a cream silk slip dress standing among deep tropical foliage, a white barn owl landing on her raised forearm, wings spread. She occupies the right half of the frame, looking up at the bird. Diffused overcast light, deep emerald greens, one warm gold highlight on her skin. Shot on 85mm, f/2.
```

**04 · Identità visiva**
```
Bold editorial portrait: a woman in a black leather coat seated against a deep bordeaux seamless backdrop, holding a vintage rotary telephone handset to her ear, red lips, hair pulled back. She sits in the right half of the frame. Hard studio key light from the right, strong shadow to the left. Graphic, high-contrast, single colour field. Shot on 85mm, f/5.6.
```

**05 · Consulenza e formazione**
```
Editorial interior photograph: a woman in tailored eucalyptus-white trousers walking through the sunlit lobby of a boutique hotel, seen in the right half of the frame, tall arched windows behind her throwing long diagonals of warm light across a stone floor. Green plants in soft focus. Calm, unposed, in motion. Shot on 35mm, f/2.8.
```

---

## 6. Портфолио по нишам — формат 3:4

Для галереи «Stile» и альбома «Lavori». Один и тот же файл годится и туда, и туда.
В конец каждого — блок ДНК бренда.

**Profumeria**
```
Editorial still life: a dark faceted perfume bottle half-buried in wet tropical foliage, water beads on the glass, a single warm gold highlight along one edge, deep emerald leaves, near-black background. Vertical composition. Shot on 100mm macro, f/2.8.
```

**Gioielleria**
```
Extreme close-up of a diamond drop earring catching a single point of light against soft bokeh, the wearer's jawline and hair out of focus behind it. Warm gold metal, cool white stone, near-black surroundings. Vertical composition. Shot on 100mm macro, f/2.5.
```

**Beauty**
```
Macro beauty photograph: a single amber serum droplet resting on the cheekbone of a woman with luminous natural skin, visible pores and fine hair, warm side light grazing the skin, background falling to near-black. Vertical composition. Shot on 100mm macro, f/3.2.
```

**Matrimoni**
```
Bridal editorial: a woman in an ivory lace gown standing on a coastal cliff at golden hour, a long veil lifting and flowing across the frame in the wind, cool sea and sky behind, one warm band of low sun. Vertical composition. Shot on 85mm, f/2.8.
```

**Hotel Boutique**
```
Interior architectural photograph of a boutique hotel suite in Tuscany at golden hour: a deep emerald velvet armchair beside a tall arched window, warm late light falling in a long diagonal across raw linen and a wide-plank oak floor, soft-focus cypress hills beyond the glass. Nobody in the room. Vertical composition, 24mm tilt-shift, f/5.6, vertical lines perfectly straight.
```

**Cantine**
```
Extreme close-up of dark red wine being poured into a crystal glass, caught mid-pour, the stream twisting, light passing through so the wine glows deep bordeaux. Oak barrels dissolve into warm blur behind. The bottle is cropped out of frame entirely so no label is visible. Vertical composition. Shot on 100mm macro, f/2.8, high-speed flash.
```

**Accessori**
```
Editorial flat lay on dark marble: a structured leather handbag, a perfume bottle and a fine gold chain arranged with generous space between them, one warm directional light from the upper left, long soft shadows, near-black surface. Vertical composition. Shot on 50mm from above, f/4.
```

**Editoriale** (кадры с тобой, линии «Regina Pantera» и «La Custode»)
```
Editorial portrait: a woman in a black velvet gown standing beside a black panther against deep bordeaux drapery, antique gold jewellery catching a single high light, composed direct gaze. Vertical composition, framed from the waist up. Shot on 85mm, f/2.2.
```
⚠ Тоже прикрепляй референс лица.

---

## 7. Тизер ниш — формат 1:1

Отдельно **не генерируй**. Возьми те же кадры из раздела 6, открой `admin.html` → нужный слот → «Заменить» → выбери тот же файл и обрежь в квадрат. Так тизер и альбом будут из одной серии, и это правильно: клиент видит один и тот же кадр в двух местах и запоминает его.

---

## 8. Видео

### Showreel · `showreel.mp4` (16:9, со звуком) и `showreel-loop.mp4` (16:9, без звука, фон секции)

Собирается не одним промптом, а нарезкой. Берёшь 6–8 своих лучших кадров, оживляешь каждый по 2–3 секунды и монтируешь встык.

Промпт оживления — общий для всех:

```
Animate this photograph into a 3-second cinematic clip. Choose the single most natural motion for the subject: fabric settling, liquid moving, light shifting across a surface, hair or feathers stirring in a light breeze. The camera makes one slow deliberate move only — a gentle push-in or a slow lateral drift. Preserve the exact colour grade, contrast and grain of the source image. Photorealistic, no stylisation. No added text, no graphics, no logo, no watermark. No morphing or warping of faces, hands or animal anatomy.
```

Монтаж: 45–60 секунд, переходы встык или короткие затемнения, музыка — инструментал без вокала. Экспортируй две версии: полную со звуком для модалки и укороченную петлю без звука на фон секции.

### Реелы для портфолио · 9:16, 1080×1920, 4–15 сек

```
Vertical 9:16 cinematic product film, 6 seconds. [ОПИШИ СЦЕНУ: например — a woman's wrist entering frame, she sprays perfume, the mist catches warm backlight from a window]. Single slow camera move, shallow depth of field, warm low-key light, deep shadows, one gold accent. Photorealistic, film grain, no stylisation. No text, no logo, no watermark, no captions burned into the frame. Silent.
```

К каждому реелу нужен **постер** — первый кадр как JPG, имя такое же плюс `-poster`. Например: `video/reel-03.mp4` → `immagini/reel-03-poster.jpg`. Достаточно вытащить кадр из видео скриншотом.

---

## 9. Проверка перед тем, как ставить на сайт

Пробегись глазами по каждому сгенерированному кадру:

- [ ] **Никакого текста.** Ни на этикетках, ни на бирках, ни на страницах, ни на стенах. Это провал номер один у всех моделей.
- [ ] **Пальцы.** Пять на каждой видимой руке, ногти естественные.
- [ ] **Лапы и морда животного**, если оно в кадре: правильное число когтей, глаза без искажений.
- [ ] **Лицо симметрично**, зубы не «слипшиеся», глаза смотрят в одну точку.
- [ ] **Отражения в стекле и металле** не разваливаются.
- [ ] **Не выглядит как рендер.** Если кожа пластиковая, а свет слишком идеальный — перегенерируй.
- [ ] **Один тёплый акцент**, не два.

---

## 10. Как поставить готовый кадр на сайт

1. Открой `admin.html` двойным кликом.
2. Найди нужную карточку → **«Заменить»**.
3. Перетащи файл, подгони кадр. Затемнённая зона — там ляжет текст сайта, лицо туда не ставь.
4. У полноэкранных слотов две вкладки — **Десктоп 16:9** и **Мобильный 3:4**. Настрой обе, нажми «Скачать оба».
5. Положи скачанные файлы в `immagini/` поверх старых. Готово.

Для видео: `.mp4` кладёшь в папку `video/`, постер в `immagini/`, и пишешь мне название — я добавлю его в список редактора.

**С чего начать, если генерировать всё сразу дорого:** hero-видео (раздел 4) → студия → пять этапов метода. Это единственные три места, где сейчас плейсхолдеры. Всё остальное уже заполнено твоими кадрами и работает.
