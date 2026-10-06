document.addEventListener("DOMContentLoaded", () => {
  const FORMSPREE_ENDPOINT = "";

  // AOS
  AOS.init({
    easing: "ease-in-out",
    duration: 600,
    once: false,
  });
  AOS.refresh();

  // Loader
  const loader = document.querySelector("#loading");
  window.addEventListener("load", () => {
    if (loader) {
      loader.classList.add("hidden");
      setTimeout(() => {
        loader.remove();
      }, 500);
    }
  });

  // Navbar
  function addStyleNavbar(navbar) {
    navbar.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
    navbar.style.backdropFilter = "blur(20px)";
    navbar.style.borderBottom = "1px solid rgba(99, 102, 241, 0.1)";
    navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)";
  }

  function removeStyleNavbar(navbar) {
    navbar.style.backgroundColor = "transparent";
    navbar.style.backdropFilter = "none";
    navbar.style.borderBottom = "none";
    navbar.style.boxShadow = "none";
  }

  const navbar = document.querySelector(".navbar");
  const navbarNav = navbar?.querySelector("#navbarNav");
  const btnToggler = navbar?.querySelector(".navbar-toggler");
  const navLinks = navbar?.querySelectorAll(".nav-link");

  // Gestion du scroll pour chaque lien de navigation
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
      // Fermer le menu sur mobile
      if (navbarNav.classList.contains("show")) {
        btnToggler.click();
      }
    });
  });

  // Etat de navigation
  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;
    const sections = document.querySelectorAll("section[id]");

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY;
    if (scrollPos > 100) {
      addStyleNavbar(navbar);
    } else {
      if (navbarNav.classList.contains("show")) {
        addStyleNavbar(navbar);
      } else {
        removeStyleNavbar(navbar);
      }
    }
    updateActiveNav();
  });

  btnToggler.addEventListener("click", () => {
    addStyleNavbar(navbar);
  });

  // Bouton "Remonter"
  const backToTopBtn = document.getElementById("backToTop");

  function toggleBackToTop() {
    if (window.scrollY > 300) {
      backToTopBtn.style.display = "block";
      backToTopBtn.style.opacity = "1";
      backToTopBtn.style.transform = "translateY(0)";
    } else {
      backToTopBtn.style.opacity = "0";
      backToTopBtn.style.transform = "translateY(20px)";
      setTimeout(() => {
        backToTopBtn.style.display = "none";
      }, 300);
    }
  }

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("scroll", toggleBackToTop);

  // Validation formulaire
  const contactForm = document.querySelector("#contact form");
  if (contactForm) {
    const nameInput = contactForm.querySelector("#name");
    const emailInput = contactForm.querySelector("#email");
    const subjectInput = contactForm.querySelector("#subject");
    const messageInput = contactForm.querySelector("#message");

    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    function showValidation(input, isValid, message) {
      const formGroup = input.closest(".col-12, .col-md-6");
      let feedback = formGroup.querySelector(".invalid-feedback");

      if (!feedback) {
        feedback = document.createElement("div");
        feedback.className = "invalid-feedback";
        input.parentNode.appendChild(feedback);
      }

      if (isValid) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        feedback.style.display = "none";
      } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        feedback.textContent = message;
        feedback.style.display = "block";
      }
    }

    nameInput.addEventListener("blur", () => {
      const isValid = nameInput.value.trim().length >= 2;
      showValidation(
        nameInput,
        isValid,
        "Le nom doit contenir au moins 2 caractères.",
      );
    });

    emailInput.addEventListener("blur", () => {
      const isValid = validateEmail(emailInput.value.trim());
      showValidation(
        emailInput,
        isValid,
        "Veuillez entrer une adresse e-mail valide.",
      );
    });

    subjectInput.addEventListener("blur", () => {
      const isValid = subjectInput.value.trim().length >= 10;
      showValidation(
        subjectInput,
        isValid,
        "Le sujet doit contenir au moins 10 caractères.",
      );
    });

    messageInput.addEventListener("blur", () => {
      const isValid = messageInput.value.trim().length >= 10;
      showValidation(
        messageInput,
        isValid,
        "Le message doit contenir au moins 10 caractères.",
      );
    });

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const isNameValid = nameInput.value.trim().length >= 2;
      const isEmailValid = validateEmail(emailInput.value.trim());
      const isSubjectValid = subjectInput.value.trim().length >= 10;
      const isMessageValid = messageInput.value.trim().length >= 10;

      if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
        const submitBtn = contactForm.querySelector("button[type='submit']");
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Envoi en cours...";
        submitBtn.disabled = true;

        const data = {
          name: nameInput.value,
          email: emailInput.value,
          subject: subjectInput.value,
          message: messageInput.value,
        };

        fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (response.ok) {
              // Le formulaire est soumis avec succès
              setTimeout(() => {
                submitBtn.textContent = "Message envoyé !";
                submitBtn.classList.add("btn-success");
                submitBtn.classList.remove("btn-primary");

                setTimeout(() => {
                  submitBtn.textContent = originalText;
                  submitBtn.classList.remove("btn-success");
                  submitBtn.classList.add("btn-primary");
                  submitBtn.disabled = false;
                  contactForm.reset();

                  // On réinitialise l'état de validation
                  [nameInput, emailInput, subjectInput, messageInput].forEach(
                    (input) => {
                      input.classList.remove("is-valid", "is-invalid");
                      const feedback =
                        input.parentNode.querySelector(".invalid-feedback");
                      if (feedback) feedback.style.display = "none";
                    },
                  );
                }, 2000);
              }, 1500);
            } else {
              response.json().then((data) => {
                if (Object.hasOwn(data, "errors")) {
                  data["errors"].map((error) => error["message"]).join(", ");
                } else {
                  console.log(
                    "Une erreur s'est produite lors de la soumission du formulaire",
                  );
                }
              });
            }
          })
          .catch((err) => {
            console.log(
              "Une erreur s'est produite lors de la soumission du formulaire : " +
                err,
            );
          });
      } else {
        nameInput.dispatchEvent(new Event("blur"));
        emailInput.dispatchEvent(new Event("blur"));
        subjectInput.dispatchEvent(new Event("blur"));
        messageInput.dispatchEvent(new Event("blur"));
      }
    });
  }

  // Année courant pour le Footer
  const currentYear = new Date().getUTCFullYear();
  document.getElementById("currentYear").textContent = currentYear;

  // Ajout d'une animation de chargement aux boutons
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!this.classList.contains("btn-loading")) {
        this.classList.add("btn-loading");
        setTimeout(() => {
          this.classList.remove("btn-loading");
        }, 1000);
      }
    });
  });
});
