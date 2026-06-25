--
-- PostgreSQL database dump
--

\restrict nZTdkQlzG0Zy4P8SswakYlSDQ3fAeMGbtmFGW0QDqekBJtWSbMAM5MLXZqXq6QO

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cotisations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cotisations (
    id integer NOT NULL,
    membre_id integer,
    montant numeric(10,2) NOT NULL,
    statut character varying(20) DEFAULT 'attente'::character varying,
    date_cotisation date DEFAULT CURRENT_DATE,
    heure_validation timestamp without time zone,
    collecteur_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    initiee_par character varying(20) DEFAULT 'collecteur'::character varying,
    mode_paiement character varying(30),
    CONSTRAINT cotisations_initiee_par_check CHECK (((initiee_par)::text = ANY ((ARRAY['collecteur'::character varying, 'membre'::character varying])::text[]))),
    CONSTRAINT cotisations_mode_paiement_check CHECK (((mode_paiement)::text = ANY ((ARRAY['mix_by_yas'::character varying, 'moov_money'::character varying])::text[]))),
    CONSTRAINT cotisations_statut_check CHECK (((statut)::text = ANY ((ARRAY['attente'::character varying, 'valide'::character varying])::text[])))
);


ALTER TABLE public.cotisations OWNER TO postgres;

--
-- Name: cotisations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cotisations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cotisations_id_seq OWNER TO postgres;

--
-- Name: cotisations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cotisations_id_seq OWNED BY public.cotisations.id;


--
-- Name: demandes_inscription; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.demandes_inscription (
    id integer NOT NULL,
    nom_microfinance character varying(100) NOT NULL,
    ville character varying(50) NOT NULL,
    telephone character varying(20) NOT NULL,
    numero_agrement character varying(50),
    nom_directeur character varying(50) NOT NULL,
    prenom_directeur character varying(50) NOT NULL,
    email_directeur character varying(100) NOT NULL,
    plan_choisi character varying(20),
    statut character varying(20) DEFAULT 'en_attente'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT demandes_inscription_plan_choisi_check CHECK (((plan_choisi)::text = ANY ((ARRAY['starter'::character varying, 'standard'::character varying, 'premium'::character varying])::text[]))),
    CONSTRAINT demandes_inscription_statut_check CHECK (((statut)::text = ANY ((ARRAY['en_attente'::character varying, 'validee'::character varying, 'rejetee'::character varying])::text[])))
);


ALTER TABLE public.demandes_inscription OWNER TO postgres;

--
-- Name: demandes_inscription_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.demandes_inscription_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.demandes_inscription_id_seq OWNER TO postgres;

--
-- Name: demandes_inscription_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.demandes_inscription_id_seq OWNED BY public.demandes_inscription.id;


--
-- Name: demandes_retrait; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.demandes_retrait (
    id integer NOT NULL,
    membre_id integer,
    montant numeric(10,2) NOT NULL,
    mode_paiement character varying(30),
    statut character varying(20) DEFAULT 'en_attente'::character varying,
    motif_rejet text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    traite_le timestamp without time zone,
    CONSTRAINT demandes_retrait_mode_paiement_check CHECK (((mode_paiement)::text = ANY ((ARRAY['mix_by_yas'::character varying, 'moov_money'::character varying])::text[]))),
    CONSTRAINT demandes_retrait_statut_check CHECK (((statut)::text = ANY ((ARRAY['en_attente'::character varying, 'validee'::character varying, 'rejetee'::character varying])::text[])))
);


ALTER TABLE public.demandes_retrait OWNER TO postgres;

--
-- Name: demandes_retrait_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.demandes_retrait_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.demandes_retrait_id_seq OWNER TO postgres;

--
-- Name: demandes_retrait_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.demandes_retrait_id_seq OWNED BY public.demandes_retrait.id;


--
-- Name: engagements_mensuels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.engagements_mensuels (
    id integer NOT NULL,
    membre_id integer,
    mois integer NOT NULL,
    annee integer NOT NULL,
    montant_journalier numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.engagements_mensuels OWNER TO postgres;

--
-- Name: engagements_mensuels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.engagements_mensuels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.engagements_mensuels_id_seq OWNER TO postgres;

--
-- Name: engagements_mensuels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.engagements_mensuels_id_seq OWNED BY public.engagements_mensuels.id;


--
-- Name: membres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.membres (
    id integer NOT NULL,
    user_id integer,
    montant_cotisation numeric(10,2) DEFAULT 0,
    solde numeric(10,2) DEFAULT 0,
    collecteur_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.membres OWNER TO postgres;

--
-- Name: membres_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.membres_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.membres_id_seq OWNER TO postgres;

--
-- Name: membres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.membres_id_seq OWNED BY public.membres.id;


--
-- Name: microfinances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.microfinances (
    id integer NOT NULL,
    nom character varying(100) NOT NULL,
    ville character varying(50) NOT NULL,
    telephone character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    statut character varying(20) DEFAULT 'en_attente'::character varying,
    plan character varying(20),
    domaine_email character varying(50),
    CONSTRAINT microfinances_plan_check CHECK (((plan)::text = ANY ((ARRAY['starter'::character varying, 'standard'::character varying, 'premium'::character varying])::text[]))),
    CONSTRAINT microfinances_statut_check CHECK (((statut)::text = ANY ((ARRAY['en_attente'::character varying, 'active'::character varying, 'rejetee'::character varying])::text[])))
);


ALTER TABLE public.microfinances OWNER TO postgres;

--
-- Name: microfinances_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.microfinances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.microfinances_id_seq OWNER TO postgres;

--
-- Name: microfinances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.microfinances_id_seq OWNED BY public.microfinances.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    nom character varying(50) NOT NULL,
    prenom character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    mot_de_passe character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    microfinance_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'collecteur'::character varying, 'membre'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: cotisations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotisations ALTER COLUMN id SET DEFAULT nextval('public.cotisations_id_seq'::regclass);


--
-- Name: demandes_inscription id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demandes_inscription ALTER COLUMN id SET DEFAULT nextval('public.demandes_inscription_id_seq'::regclass);


--
-- Name: demandes_retrait id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demandes_retrait ALTER COLUMN id SET DEFAULT nextval('public.demandes_retrait_id_seq'::regclass);


--
-- Name: engagements_mensuels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.engagements_mensuels ALTER COLUMN id SET DEFAULT nextval('public.engagements_mensuels_id_seq'::regclass);


--
-- Name: membres id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membres ALTER COLUMN id SET DEFAULT nextval('public.membres_id_seq'::regclass);


--
-- Name: microfinances id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.microfinances ALTER COLUMN id SET DEFAULT nextval('public.microfinances_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: cotisations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cotisations (id, membre_id, montant, statut, date_cotisation, heure_validation, collecteur_id, created_at, initiee_par, mode_paiement) FROM stdin;
1	1	5000.00	valide	2026-01-05	\N	2	2026-06-06 13:13:48.991802	collecteur	\N
2	1	5000.00	valide	2026-02-05	\N	2	2026-06-06 13:13:48.991802	collecteur	\N
3	1	5000.00	attente	2026-03-05	\N	2	2026-06-06 13:13:48.991802	collecteur	\N
\.


--
-- Data for Name: demandes_inscription; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.demandes_inscription (id, nom_microfinance, ville, telephone, numero_agrement, nom_directeur, prenom_directeur, email_directeur, plan_choisi, statut, created_at) FROM stdin;
\.


--
-- Data for Name: demandes_retrait; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.demandes_retrait (id, membre_id, montant, mode_paiement, statut, motif_rejet, created_at, traite_le) FROM stdin;
\.


--
-- Data for Name: engagements_mensuels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.engagements_mensuels (id, membre_id, mois, annee, montant_journalier, created_at) FROM stdin;
1	1	6	2026	5000.00	2026-06-22 23:32:19.748279
\.


--
-- Data for Name: membres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.membres (id, user_id, montant_cotisation, solde, collecteur_id, created_at) FROM stdin;
1	3	5000.00	15000.00	2	2026-06-06 13:13:48.991802
\.


--
-- Data for Name: microfinances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.microfinances (id, nom, ville, telephone, created_at, statut, plan, domaine_email) FROM stdin;
1	CECAV Fraternité	Lomé	+228 90 00 00 00	2026-06-06 13:13:48.991802	active	standard	cecav
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, nom, prenom, email, mot_de_passe, role, microfinance_id, created_at) FROM stdin;
2	Agent	Collecteur	collecteur@cotipay.tg	$2a$10$K7bE2rT5nM9pQ1wS3dF6gH8jK0lZ2xC4vB5nM7qR9sT1uV3wX5yZ6a	collecteur	1	2026-06-06 13:13:48.991802
3	Koffi	Membre	membre@cotipay.tg	$2a$10$P4qR6tU8vW0xY2zA4cE6gI8kM0oQ2sU4wY6aC8eG0iK2mN4pQ6rS	membre	1	2026-06-06 13:13:48.991802
1	Admin	Test	admin@cotipay.tg	$2a$10$K7bE7t5nM9p01wSgF6oP8jHcZxC4v5M6n7P8q9R0s1T2u3V4w5X6y7z	admin	1	2026-06-06 13:13:48.991802
\.


--
-- Name: cotisations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cotisations_id_seq', 3, true);


--
-- Name: demandes_inscription_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.demandes_inscription_id_seq', 1, false);


--
-- Name: demandes_retrait_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.demandes_retrait_id_seq', 1, false);


--
-- Name: engagements_mensuels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.engagements_mensuels_id_seq', 1, true);


--
-- Name: membres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.membres_id_seq', 1, true);


--
-- Name: microfinances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.microfinances_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: cotisations cotisations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotisations
    ADD CONSTRAINT cotisations_pkey PRIMARY KEY (id);


--
-- Name: demandes_inscription demandes_inscription_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demandes_inscription
    ADD CONSTRAINT demandes_inscription_pkey PRIMARY KEY (id);


--
-- Name: demandes_retrait demandes_retrait_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demandes_retrait
    ADD CONSTRAINT demandes_retrait_pkey PRIMARY KEY (id);


--
-- Name: engagements_mensuels engagements_mensuels_membre_id_mois_annee_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.engagements_mensuels
    ADD CONSTRAINT engagements_mensuels_membre_id_mois_annee_key UNIQUE (membre_id, mois, annee);


--
-- Name: engagements_mensuels engagements_mensuels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.engagements_mensuels
    ADD CONSTRAINT engagements_mensuels_pkey PRIMARY KEY (id);


--
-- Name: membres membres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membres
    ADD CONSTRAINT membres_pkey PRIMARY KEY (id);


--
-- Name: membres membres_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membres
    ADD CONSTRAINT membres_user_id_key UNIQUE (user_id);


--
-- Name: microfinances microfinances_domaine_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.microfinances
    ADD CONSTRAINT microfinances_domaine_email_key UNIQUE (domaine_email);


--
-- Name: microfinances microfinances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.microfinances
    ADD CONSTRAINT microfinances_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: cotisations cotisations_collecteur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotisations
    ADD CONSTRAINT cotisations_collecteur_id_fkey FOREIGN KEY (collecteur_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: cotisations cotisations_membre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotisations
    ADD CONSTRAINT cotisations_membre_id_fkey FOREIGN KEY (membre_id) REFERENCES public.membres(id) ON DELETE CASCADE;


--
-- Name: demandes_retrait demandes_retrait_membre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demandes_retrait
    ADD CONSTRAINT demandes_retrait_membre_id_fkey FOREIGN KEY (membre_id) REFERENCES public.membres(id) ON DELETE CASCADE;


--
-- Name: engagements_mensuels engagements_mensuels_membre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.engagements_mensuels
    ADD CONSTRAINT engagements_mensuels_membre_id_fkey FOREIGN KEY (membre_id) REFERENCES public.membres(id) ON DELETE CASCADE;


--
-- Name: membres membres_collecteur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membres
    ADD CONSTRAINT membres_collecteur_id_fkey FOREIGN KEY (collecteur_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: membres membres_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membres
    ADD CONSTRAINT membres_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users users_microfinance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_microfinance_id_fkey FOREIGN KEY (microfinance_id) REFERENCES public.microfinances(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict nZTdkQlzG0Zy4P8SswakYlSDQ3fAeMGbtmFGW0QDqekBJtWSbMAM5MLXZqXq6QO

