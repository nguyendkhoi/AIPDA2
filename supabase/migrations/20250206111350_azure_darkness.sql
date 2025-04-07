/*
  # Schéma initial pour le Tour AIPDA

  1. Tables
    - `profiles`
      - Informations des utilisateurs
      - Lié à auth.users
    - `programs`
      - Programmes proposés/disponibles
      - Gestion des sessions et campagnes
    - `registrations`
      - Inscriptions des participants aux programmes
    - `program_proposals`
      - Propositions des animateurs
  
  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques pour participants et animateurs
*/

-- Création de l'enum pour les types de programmes
CREATE TYPE program_type AS ENUM ('Webinaire', 'Atelier', 'Talk');

-- Création de l'enum pour les sous-types d'ateliers
CREATE TYPE workshop_type AS ENUM (
  'Atelier de conception graphique',
  'Atelier de Design de marque',
  'Atelier de Design social'
);

-- Création de l'enum pour les sous-types de talks
CREATE TYPE talk_type AS ENUM (
  'Le design au service des styles',
  'Le design au service des processus',
  'Le design au services des stratégies'
);

-- Table des profils utilisateurs
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('Participant', 'Animateur')),
  bio TEXT,
  expertise TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des programmes
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type program_type NOT NULL,
  subtype TEXT, -- workshop_type ou talk_type
  title TEXT NOT NULL,
  description TEXT,
  campaign_month TEXT NOT NULL,
  week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 3),
  session_date TIMESTAMPTZ NOT NULL,
  max_participants INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des inscriptions
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id) NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(program_id, user_id)
);

-- Table des propositions de programmes
CREATE TABLE program_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animator_id UUID REFERENCES profiles(id) NOT NULL,
  type program_type NOT NULL,
  subtype TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  preferred_dates TIMESTAMPTZ[],
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Activation de la sécurité RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_proposals ENABLE ROW LEVEL SECURITY;

-- Politiques pour profiles
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Politiques pour programs
CREATE POLICY "Tout le monde peut voir les programmes"
  ON programs FOR SELECT
  TO authenticated
  USING (true);

-- Politiques pour registrations
CREATE POLICY "Les utilisateurs peuvent voir leurs inscriptions"
  ON registrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent créer leurs inscriptions"
  ON registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Politiques pour program_proposals
CREATE POLICY "Les animateurs peuvent voir leurs propositions"
  ON program_proposals FOR SELECT
  USING (auth.uid() = animator_id);

CREATE POLICY "Les animateurs peuvent créer des propositions"
  ON program_proposals FOR INSERT
  WITH CHECK (
    auth.uid() = animator_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'Animateur'
    )
  );

-- Fonction pour mettre à jour les timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour mettre à jour updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_programs_updated_at
  BEFORE UPDATE ON programs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_program_proposals_updated_at
  BEFORE UPDATE ON program_proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();