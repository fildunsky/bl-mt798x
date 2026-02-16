const UI_LANG_KEY = 'failsafe_lang';
const UI_THEME_KEY = 'failsafe_theme';

const I18N = {
    en: {
        language: 'Language',
        theme: 'Theme',
        themeAuto: 'Auto',
        themeLight: 'Light',
        themeDark: 'Dark',
        pageTitle: 'Firmware update',
        heading: 'FIRMWARE UPDATE',
        hint: 'You are going to update <strong>firmware</strong> on the device.<br>Please, choose file from your local hard drive and click <strong>Upload</strong> button.',
        chooseLayout: 'Choose mtd layout:',
        upload: 'Upload',
        sizePrefix: 'Size: ',
        md5Prefix: 'MD5: ',
        mtdPrefix: 'MTD layout: ',
        upgradeHint: 'If all information above is correct, click "Update".',
        upgradeButton: 'Update',
        warningsTitle: 'WARNINGS',
        warnings: [
            'do not power off the device during update',
            'if everything goes well, the device will restart',
            'you can upload whatever you want, so be sure that you choose proper firmware image for your device'
        ],
        currentLayoutPrefix: 'Current mtd layout: '
    },
    ru: {
        language: 'Язык',
        theme: 'Тема',
        themeAuto: 'Авто',
        themeLight: 'Светлая',
        themeDark: 'Тёмная',
        pageTitle: 'Обновление прошивки',
        heading: 'ОБНОВЛЕНИЕ ПРОШИВКИ',
        hint: 'Сейчас вы обновите <strong>прошивку</strong> устройства.<br>Выберите файл на локальном диске и нажмите кнопку <strong>Загрузить</strong>.',
        chooseLayout: 'Выберите разметку MTD:',
        upload: 'Загрузить',
        sizePrefix: 'Размер: ',
        md5Prefix: 'MD5: ',
        mtdPrefix: 'Разметка MTD: ',
        upgradeHint: 'Если информация выше верна, нажмите «Обновить».',
        upgradeButton: 'Обновить',
        warningsTitle: 'ПРЕДУПРЕЖДЕНИЯ',
        warnings: [
            'не отключайте питание устройства во время обновления',
            'если всё пройдёт успешно, устройство перезагрузится',
            'можно загрузить любой файл, поэтому убедитесь, что выбран правильный образ прошивки'
        ],
        currentLayoutPrefix: 'Текущая разметка MTD: '
    }
};

function safeLocalStorageGet(key) {
    try {
        return localStorage.getItem(key);
    } catch (e) {
        return null;
    }
}

function safeLocalStorageSet(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        /* ignore */
    }
}

function detectSystemLang() {
    const lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    return lang.indexOf('ru') === 0 ? 'ru' : 'en';
}

function getCurrentLang() {
    return safeLocalStorageGet(UI_LANG_KEY) || detectSystemLang();
}

function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
        return 'dark';
    return 'light';
}

function getThemePreference() {
    return safeLocalStorageGet(UI_THEME_KEY) || 'auto';
}

function applyTheme() {
    const pref = getThemePreference();
    const theme = pref === 'auto' ? detectSystemTheme() : pref;

    if (theme === 'dark')
        document.documentElement.classList.add('theme-dark');
    else
        document.documentElement.classList.remove('theme-dark');
}

function applyTranslations() {
    const lang = getCurrentLang();
    const t = I18N[lang] || I18N.en;

    document.documentElement.lang = lang;

    const title = document.getElementById('page_title');
    if (title)
        title.textContent = t.pageTitle;

    const heading = document.getElementById('main_heading');
    if (heading)
        heading.textContent = t.heading;

    const hint = document.getElementById('hint');
    if (hint)
        hint.innerHTML = t.hint;

    const chooseLayout = document.getElementById('choose_layout_label');
    if (chooseLayout)
        chooseLayout.textContent = t.chooseLayout;

    const uploadBtn = document.getElementById('upload_btn');
    if (uploadBtn)
        uploadBtn.value = t.upload;

    const upgradeHint = document.getElementById('upgrade_hint');
    if (upgradeHint)
        upgradeHint.textContent = t.upgradeHint;

    const upgradeBtn = document.getElementById('upgrade_btn');
    if (upgradeBtn)
        upgradeBtn.textContent = t.upgradeButton;

    const warningsTitle = document.getElementById('warnings_title');
    if (warningsTitle)
        warningsTitle.textContent = t.warningsTitle;

    const warnList = document.getElementById('warnings_list');
    if (warnList && warnList.children.length >= 3) {
        for (let i = 0; i < 3; i++)
            warnList.children[i].textContent = t.warnings[i];
    }

    const size = document.getElementById('size');
    if (size && size.dataset.value)
        size.textContent = t.sizePrefix + size.dataset.value;

    const md5 = document.getElementById('md5');
    if (md5 && md5.dataset.value)
        md5.textContent = t.md5Prefix + md5.dataset.value;

    const mtd = document.getElementById('mtd');
    if (mtd && mtd.dataset.value)
        mtd.textContent = t.mtdPrefix + mtd.dataset.value;

    const currentMtd = document.getElementById('current_mtd_layout');
    if (currentMtd && currentMtd.dataset.value)
        currentMtd.textContent = t.currentLayoutPrefix + currentMtd.dataset.value;

    const langLabel = document.getElementById('lang_label');
    if (langLabel)
        langLabel.textContent = t.language;

    const themeLabel = document.getElementById('theme_label');
    if (themeLabel)
        themeLabel.textContent = t.theme;

    const themeSel = document.getElementById('theme_switcher');
    if (themeSel && themeSel.options.length >= 3) {
        themeSel.options[0].text = t.themeAuto;
        themeSel.options[1].text = t.themeLight;
        themeSel.options[2].text = t.themeDark;
    }
}

function initUiControls() {
    if (document.getElementById('ui_controls'))
        return;

    const controls = document.createElement('div');
    controls.id = 'ui_controls';
    controls.innerHTML =
        '<label id="lang_label" for="lang_switcher">Language</label>' +
        '<select id="lang_switcher"><option value="en">EN</option><option value="ru">RU</option></select>' +
        '<label id="theme_label" for="theme_switcher">Theme</label>' +
        '<select id="theme_switcher"><option value="auto">Auto</option><option value="light">Light</option><option value="dark">Dark</option></select>';

    document.body.appendChild(controls);

    const langSel = document.getElementById('lang_switcher');
    langSel.value = getCurrentLang();
    langSel.onchange = function() {
        safeLocalStorageSet(UI_LANG_KEY, langSel.value);
        applyTranslations();
    };

    const themeSel = document.getElementById('theme_switcher');
    themeSel.value = getThemePreference();
    themeSel.onchange = function() {
        safeLocalStorageSet(UI_THEME_KEY, themeSel.value);
        applyTheme();
        applyTranslations();
    };

    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
            if (getThemePreference() === 'auto')
                applyTheme();
        });
    }
}

function initUi() {
    initUiControls();
    applyTheme();
    applyTranslations();
}

function ajax(opt) {
    var xmlhttp;

    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
    }

    xmlhttp.upload.addEventListener('progress', function (e) {
        if (opt.progress)
            opt.progress(e)
    })

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (opt.done)
                opt.done(xmlhttp.responseText);
        }
    }

    if (opt.timeout)
        xmlhttp.timeout = opt.timeout;

    var method = 'GET';

    if (opt.data)
        method = 'POST'

    xmlhttp.open(method, opt.url);
    xmlhttp.send(opt.data);
}

function startup(){
    initUi();
    getversion();
    getmtdlayoutlist();
}

function getmtdlayoutlist() {
    ajax({
        url: '/getmtdlayout',
        done: function(mtd_layout_list) {
            if (mtd_layout_list == "error")
                return;

            var mtd_layout = mtd_layout_list.split(';');

            var current = document.getElementById('current_mtd_layout');
            current.dataset.value = mtd_layout[0];

            var e = document.getElementById('mtd_layout_label');

            for (var i=1; i<mtd_layout.length; i++) {
                if (mtd_layout[i].length > 0) {
                    e.options.add(new Option(mtd_layout[i], mtd_layout[i]));
                }
            }
            document.getElementById('mtd_layout').style.display = '';
            applyTranslations();
        }
    })
}

function getversion() {
    initUi();
    ajax({
        url: '/version',
        done: function(version) {
            document.getElementById('version').innerHTML = version
        }
    })
}

function upload(name) {
    var file = document.getElementById('file').files[0]
    if (!file)
        return

    document.getElementById('form').style.display = 'none';
    document.getElementById('hint').style.display = 'none';

    var form = new FormData();
    form.append(name, file);

    var mtd_layout_list = document.getElementById('mtd_layout_label');
    if (mtd_layout_list && mtd_layout_list.options.length > 0) {
        var mtd_idx = mtd_layout_list.selectedIndex;
        form.append("mtd_layout", mtd_layout_list.options[mtd_idx].value);
    }

    ajax({
        url: '/upload',
        data: form,
        done: function(resp) {
            if (resp == 'fail') {
                location = '/fail.html';
            } else {
                const info = resp.split(' ');

                document.getElementById('size').style.display = 'block';
                document.getElementById('size').dataset.value = info[0];

                document.getElementById('md5').style.display = 'block';
                document.getElementById('md5').dataset.value = info[1];

                if (info[2]) {
                    document.getElementById('mtd').style.display = 'block';
                    document.getElementById('mtd').dataset.value = info[2];
                }

                applyTranslations();
                document.getElementById('upgrade').style.display = 'block';
            }
        },
        progress: function(e) {
            var percentage = parseInt(e.loaded / e.total * 100)
            document.getElementById('bar').setAttribute('style', '--percent: ' + percentage);
        }
    })
}
