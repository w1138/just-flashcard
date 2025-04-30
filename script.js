


const flashcards = [
    { question: "Bonjour", answer: "Hello" },
    { question: "Merci", answer: "Thank you" },
    { question: "Oui", answer: "Yes" },
    { question: "Non", answer: "No" },
];

const jsonFileName = 'myflashcards.json'; // file name used to export and import data
let currentCardIndex = 0;
let score = 0;
const flashcardElement = document.getElementById('flashcard');
const questionElement = document.getElementById('question');
const answerElement = document.getElementById('answer');
const nextCardButton = document.getElementById('next-card');
const editModeElement = document.getElementById('edit-mode');
const listModeElement = document.getElementById('list-mode');
const editForm = document.getElementById('edit-form');
const toggleEditModeButton = document.getElementById('btn_edit');
const toggleListModeButton = document.getElementById('btn_list');
const cardListElement = document.getElementById('card-list');
const confirmationMessage = document.getElementById('confirmation-message');
const resultButtons = document.getElementById('result-buttons');
const correctButton = document.getElementById('correct-button');
const wrongButton = document.getElementById('wrong-button');
const scoreElement = document.getElementById('score');
const scoreContainer = document.getElementById('score-container');
const exportButton = document.getElementById('btn_export');
const importButton = document.getElementById('btn_import');
const importFileInput = document.getElementById('import-file');
const languageSelector = document.getElementById('language');
const focusModeToggle = document.getElementById('focus-mode-toggle');
const focusModeLabel = document.getElementById('focus-mode-label');
const footer = document.getElementById('myFooter');
const menu_button = document.getElementById('menu_button');
const sideBar = document.getElementById('mySidebar');
const websiteTitle = document.getElementById('website_title');



// Fonction pour mettre à jour les textes en fonction de la langue
function updateLanguage(lang) {
    const texts = translations[lang];

    toggleEditModeButton.textContent = texts.toggleEditMode;
    toggleListModeButton.textContent = texts.toggleListMode;
    exportButton.textContent = texts.exportButton;
    importButton.textContent = texts.importButton;
    nextCardButton.textContent = texts.nextCard;
    correctButton.textContent = texts.correctButton;
    wrongButton.textContent = texts.wrongButton;
    editModeElement.querySelector('h2').textContent = texts.editModeTitle;
    editForm.querySelector('label[for="new-question"]').textContent = texts.newQuestionLabel;
    editForm.querySelector('label[for="new-answer"]').textContent = texts.newAnswerLabel;
    editForm.querySelector('button[type="submit"]').textContent = texts.addCardButton;
    confirmationMessage.textContent = texts.confirmationMessage;
    listModeElement.querySelector('h2').textContent = texts.listModeTitle;
    document.querySelector('#score-container span:first-child').textContent = texts.scoreLabel;
}

// Écouteur pour le changement de langue
languageSelector.addEventListener('change', (event) => {
    const selectedLanguage = event.target.value;
    updateLanguage(selectedLanguage);
});

// Initialiser la langue par défaut
updateLanguage('fr');

// Fonction pour enregistrer les cartes dans le stockage local
function saveCardsToLocalStorage() {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

// Fonction pour charger les cartes depuis le stockage local
function loadCardsFromLocalStorage() {
    const savedCards = localStorage.getItem('flashcards');
    if (savedCards) {
        flashcards.length = 0; // Vider le tableau actuel
        flashcards.push(...JSON.parse(savedCards)); // Ajouter les cartes sauvegardées
        updateCardList(); // Mettre à jour la liste des cartes
    }
}


// ---------------------------------------------------------------------
// Fonctions
// ---------------------------------------------------------------------


// Fonction pour afficher une carte
function showCard() {
    const currentCard = flashcards[currentCardIndex];

    // Contrôle de sécurité user input : échappement avant affichage







    questionElement.textContent = currentCard.question;
    answerElement.textContent = currentCard.answer;

    // contrôle si c'est un emoji et adaptation de la taille en conséquence
    // const regexEmoji = /\p{Emoji}/u; --> pour emoji "simple"
    // const regexEmojiCombined = /[\p{Emoji}\u200D]/gu; --> pour emoji complexe mais aussi avec du texte
    const regexOnlyEmojis = /^[\p{Emoji}\s]+$/u; // seulement pour emoji-s
    if (regexOnlyEmojis.test(currentCard.question)) {
      questionElement.classList.add('emoji');
      questionElement.classList.remove('w3-xlarge');
    } else {
      questionElement.classList.remove('emoji');
      questionElement.classList.add('w3-xlarge');
    }
    if (regexOnlyEmojis.test(currentCard.answer)) {
      answerElement.classList.add('emoji');
      answerElement.classList.remove('w3-xlarge');
    } else {
      answerElement.classList.remove('emoji');
      answerElement.classList.add('w3-xlarge');
    }

    // Appliquer l'effet de fondu venant du haut
    flashcardElement.classList.remove('fade-in');
    void flashcardElement.offsetWidth;
    flashcardElement.classList.add('fade-in');

    // Réinitialiser l'état de la carte (face visible)
    flashcardElement.classList.remove('flipped');
    resultButtons.classList.add('hidden'); // Masquer les boutons de résultat
}

// Fonction pour retourner la carte
function flipCard() {
    flashcardElement.classList.toggle('flipped');
    resultButtons.classList.remove('hidden'); // Afficher les boutons de résultat
}

// Fonction pour passer à une carte aléatoire
function nextCard() {
    let newCardIndex;
    do {
        newCardIndex = Math.floor(Math.random() * flashcards.length);
    } while (newCardIndex === currentCardIndex);

    currentCardIndex = newCardIndex;
    showCard();
}

// Fonction pour mettre à jour le score
function updateScore(points) {
    score += points;
    scoreElement.textContent = score;
}

// Fonction pour basculer entre les modes
function toggleMode(mode) {
    editModeElement.classList.add('hidden');
    listModeElement.classList.add('hidden');
    confirmationMessage.classList.add('hidden');

    const lang = languageSelector.value;
    const texts = translations[lang];

    if (mode === 'edit') {
        editModeElement.classList.remove('hidden');
        toggleEditModeButton.textContent = texts.toggleEditModeReturn;
    } else if (mode === 'list') {
        listModeElement.classList.remove('hidden');
        toggleListModeButton.textContent = texts.toggleListModeReturn;
        updateCardList();
    } else {
        toggleEditModeButton.textContent = texts.toggleEditMode;
        toggleListModeButton.textContent = texts.toggleListMode;
    }
}

// Fonction pour ajouter une nouvelle carte
function addCard(event) {
    event.preventDefault(); // Empêcher le rechargement de la page

    let newQuestion = document.getElementById('new-question').value;
    let newAnswer = document.getElementById('new-answer').value;

    // Contrôle de sécurité user input : contrôle des caractères entré









    if (newQuestion && newAnswer) {
        flashcards.push({ question: newQuestion, answer: newAnswer });
        confirmationMessage.textContent = translations[languageSelector.value].confirmationMessage;
        confirmationMessage.classList.remove('hidden');
        confirmationMessage.classList.remove('fade-out');

        // Effacer le message après 2 secondes avec un effet de fondu
        setTimeout(() => {
            confirmationMessage.classList.add('fade-out');
        }, 2000);

        editForm.reset(); // Réinitialiser le formulaire
        updateCardList(); // Mettre à jour la liste des cartes
        saveCardsToLocalStorage(); // Sauvegarder les cartes dans le stockage local
    } else {
        alert("Veuillez remplir tous les champs.");
    }
}

// Fonction pour mettre à jour la liste des cartes
function updateCardList() {
    cardListElement.innerHTML = ''; // Vider la liste actuelle

    flashcards.forEach((card, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${card.question} - ${card.answer}</span>
            <i class="fas fa-trash delete-icon" data-index="${index}"></i>
        `;
        cardListElement.appendChild(li);
    });

    // Ajouter des écouteurs d'événements pour les icônes de poubelle
    document.querySelectorAll('.delete-icon').forEach(icon => {
        icon.addEventListener('click', deleteCard);
    });
}

// Fonction pour supprimer une carte
function deleteCard(event) {
    const index = event.target.getAttribute('data-index');
    const card = flashcards[index];
    const confirmDelete = confirm(`Êtes-vous sûr de vouloir supprimer la carte "${card.question}" ?`);

    if (confirmDelete) {
        flashcards.splice(index, 1); // Supprimer la carte du tableau
        updateCardList(); // Mettre à jour la liste des cartes
        saveCardsToLocalStorage(); // Sauvegarder les cartes dans le stockage local
    }
}

// Fonction pour exporter les cartes
function exportCards() {
    const dataStr = JSON.stringify(flashcards, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const a = document.createElement('a');
    a.href = url;
    a.download = jsonFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Fonction pour importer des cartes
function importCards(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedCards = JSON.parse(e.target.result);
            flashcards.length = 0; // Vider le tableau actuel
            flashcards.push(...importedCards); // Ajouter les nouvelles cartes
            updateCardList(); // Mettre à jour la liste des cartes
            saveCardsToLocalStorage(); // Sauvegarder les cartes dans le stockage local
            alert('Cartes importées avec succès !');
        } catch (error) {
            alert('Erreur lors de l\'importation des cartes. Vérifiez le format du fichier.');
        }
    };
    reader.readAsText(file);
}



// Fonction pour activer/désactiver le mode focus
function toggleFocusMode() {
    focus_mode = document.body.classList.toggle('focus-mode');

    if (focus_mode) {
        wrongButton.classList.add('hidden');
        correctButton.classList.add('hidden');
        scoreContainer.classList.add('hidden');
        footer.classList.add('hidden');

        menu_button.classList.remove('w3-hide-large');
        sideBar.classList.add('w3-hide-large');
        sideBar.classList.remove('w3-collapse');
        websiteTitle.classList.remove('w3-bar-item');
        websiteTitle.classList.add('hidden');

    } else {
        wrongButton.classList.remove('hidden');
        correctButton.classList.remove('hidden');
        scoreContainer.classList.remove('hidden');
        footer.classList.remove('hidden');
        
        menu_button.classList.add('w3-hide-large');
        sideBar.classList.remove('w3-hide-large');
        sideBar.classList.add('w3-collapse');
        websiteTitle.classList.add('w3-bar-item');
        websiteTitle.classList.remove('hidden');
        
    }
}


// ---------------------------------------------------------------------
// Événements
// ---------------------------------------------------------------------



// Écouteur d'événement pour le bouton menu_button
let isMenuOpen = false; // Variable pour suivre l'état du menu

menu_button.addEventListener('click', () => {
    if (document.body.classList.contains('focus-mode')) {
        if (isMenuOpen) {
            // Fermer le menu
            sideBar.classList.add('w3-hide-large');
            sideBar.classList.remove('w3-collapse');
            //overlayBg.style.display = "none";
            isMenuOpen = false;
        } else {
            // Ouvrir le menu
            sideBar.classList.remove('w3-hide-large');
            sideBar.classList.add('w3-collapse');
            //overlayBg.style.display = "block";
            isMenuOpen = true;
        }
    }
});



flashcardElement.addEventListener('click', flipCard);
nextCardButton.addEventListener('click', nextCard);
toggleEditModeButton.addEventListener('click', () => {
    if (editModeElement.classList.contains('hidden')) {
        toggleMode('edit');
    } else {
        toggleMode('revision');
    }
});
toggleListModeButton.addEventListener('click', () => {
    if (listModeElement.classList.contains('hidden')) {
        toggleMode('list');
    } else {
        toggleMode('revision');
    }
});
editForm.addEventListener('submit', addCard);
correctButton.addEventListener('click', () => {
    updateScore(1); // Ajouter 1 point pour une réponse correcte
    nextCard(); // Passer à la carte suivante
});
wrongButton.addEventListener('click', () => {
    updateScore(-1); // Retirer 1 point pour une réponse incorrecte
    nextCard(); // Passer à la carte suivante
});
exportButton.addEventListener('click', exportCards);
importButton.addEventListener('click', () => importFileInput.click());
importFileInput.addEventListener('change', importCards);
focusModeToggle.addEventListener('change', toggleFocusMode);



// ---------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------

// Charger les cartes au démarrage
loadCardsFromLocalStorage();

// Afficher la première carte au chargement de la page
showCard();





