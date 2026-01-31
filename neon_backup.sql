--
-- PostgreSQL database dump
--

\restrict NhY6UvmMup8ACLBrgEI5RyC4ISVOI05DgcqZscSTJqVDOZpf8YuE54X8rIBt0qK

-- Dumped from database version 16.10 (0374078)
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: admin_flags; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.admin_flags (
    id integer NOT NULL,
    flag_type character varying NOT NULL,
    severity character varying NOT NULL,
    target_user_id character varying,
    target_invite_code_id integer,
    description text NOT NULL,
    metadata jsonb,
    status character varying DEFAULT 'pending'::character varying,
    investigated_by character varying,
    investigation_notes text,
    resolved_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    investigated_at timestamp without time zone,
    CONSTRAINT admin_flags_flag_type_check CHECK (((flag_type)::text = ANY ((ARRAY['rapid_invite_usage'::character varying, 'rapid_xp_gain'::character varying, 'suspicious_pattern'::character varying, 'collusion_detected'::character varying])::text[]))),
    CONSTRAINT admin_flags_severity_check CHECK (((severity)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'critical'::character varying])::text[]))),
    CONSTRAINT admin_flags_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'investigating'::character varying, 'resolved'::character varying, 'dismissed'::character varying])::text[])))
);


ALTER TABLE public.admin_flags OWNER TO neondb_owner;

--
-- Name: admin_flags_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.admin_flags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_flags_id_seq OWNER TO neondb_owner;

--
-- Name: admin_flags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.admin_flags_id_seq OWNED BY public.admin_flags.id;


--
-- Name: admin_sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.admin_sessions (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    session_token character varying NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.admin_sessions OWNER TO neondb_owner;

--
-- Name: admin_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.admin_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_sessions_id_seq OWNER TO neondb_owner;

--
-- Name: admin_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.admin_sessions_id_seq OWNED BY public.admin_sessions.id;


--
-- Name: business_profiles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.business_profiles (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    company_name character varying NOT NULL,
    slug character varying NOT NULL,
    industry character varying,
    website character varying,
    email character varying,
    description text,
    logo_url character varying,
    plan character varying DEFAULT 'free'::character varying NOT NULL,
    invite_code character varying NOT NULL,
    is_deployed boolean DEFAULT false,
    deployed_at timestamp without time zone,
    total_reviews integer DEFAULT 0,
    average_rating integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.business_profiles OWNER TO neondb_owner;

--
-- Name: business_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.business_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.business_profiles_id_seq OWNER TO neondb_owner;

--
-- Name: business_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.business_profiles_id_seq OWNED BY public.business_profiles.id;


--
-- Name: comment_votes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.comment_votes (
    id integer NOT NULL,
    comment_id integer NOT NULL,
    user_id character varying NOT NULL,
    vote_type character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.comment_votes OWNER TO neondb_owner;

--
-- Name: comment_votes_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.comment_votes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comment_votes_id_seq OWNER TO neondb_owner;

--
-- Name: comment_votes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.comment_votes_id_seq OWNED BY public.comment_votes.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    content text NOT NULL,
    author_id character varying NOT NULL,
    issue_id integer NOT NULL,
    stance character varying,
    upvotes integer DEFAULT 0,
    downvotes integer DEFAULT 0,
    is_early_participant boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    parent_comment_id integer
);


ALTER TABLE public.comments OWNER TO neondb_owner;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_id_seq OWNER TO neondb_owner;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: companies; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    external_id character varying NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    logo character varying,
    description text,
    website character varying,
    email character varying,
    phone character varying,
    category character varying,
    is_active boolean DEFAULT true,
    is_verified boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    founded character varying(50),
    key_features text[]
);


ALTER TABLE public.companies OWNER TO neondb_owner;

--
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.companies_id_seq OWNER TO neondb_owner;

--
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- Name: company_admins; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.company_admins (
    id integer NOT NULL,
    company_id integer NOT NULL,
    user_id character varying NOT NULL,
    role character varying DEFAULT 'admin'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.company_admins OWNER TO neondb_owner;

--
-- Name: company_admins_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.company_admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.company_admins_id_seq OWNER TO neondb_owner;

--
-- Name: company_admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.company_admins_id_seq OWNED BY public.company_admins.id;


--
-- Name: company_users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.company_users (
    id integer NOT NULL,
    company_id integer NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    first_name character varying,
    last_name character varying,
    role character varying DEFAULT 'admin'::character varying,
    is_active boolean DEFAULT true,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.company_users OWNER TO neondb_owner;

--
-- Name: company_users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.company_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.company_users_id_seq OWNER TO neondb_owner;

--
-- Name: company_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.company_users_id_seq OWNED BY public.company_users.id;


--
-- Name: content_reports; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.content_reports (
    id integer NOT NULL,
    content_type character varying NOT NULL,
    content_id integer NOT NULL,
    reported_by character varying NOT NULL,
    reason character varying NOT NULL,
    notes text,
    status character varying DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.content_reports OWNER TO neondb_owner;

--
-- Name: content_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.content_reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.content_reports_id_seq OWNER TO neondb_owner;

--
-- Name: content_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.content_reports_id_seq OWNED BY public.content_reports.id;


--
-- Name: creda_activities; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.creda_activities (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    activity_type character varying NOT NULL,
    creda_awarded integer NOT NULL,
    target_type character varying,
    target_id integer,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.creda_activities OWNER TO neondb_owner;

--
-- Name: daily_tasks_config; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.daily_tasks_config (
    id integer NOT NULL,
    config_key character varying NOT NULL,
    config_value text NOT NULL,
    description text,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.daily_tasks_config OWNER TO neondb_owner;

--
-- Name: daily_tasks_config_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.daily_tasks_config_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.daily_tasks_config_id_seq OWNER TO neondb_owner;

--
-- Name: daily_tasks_config_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.daily_tasks_config_id_seq OWNED BY public.daily_tasks_config.id;


--
-- Name: daily_tasks_progress; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.daily_tasks_progress (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    task_date character varying NOT NULL,
    engagement_actions_completed integer DEFAULT 0,
    is_streak_eligible boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.daily_tasks_progress OWNER TO neondb_owner;

--
-- Name: daily_tasks_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.daily_tasks_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.daily_tasks_progress_id_seq OWNER TO neondb_owner;

--
-- Name: daily_tasks_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.daily_tasks_progress_id_seq OWNED BY public.daily_tasks_progress.id;


--
-- Name: daos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.daos (
    id integer NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    description text,
    logo_url character varying,
    created_by character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    twitter_handle character varying,
    twitter_url character varying,
    website character varying,
    category character varying DEFAULT 'DeFi'::character varying,
    is_verified boolean DEFAULT false,
    is_unclaimed boolean DEFAULT true,
    claimed_by character varying,
    claimed_at timestamp without time zone
);


ALTER TABLE public.daos OWNER TO neondb_owner;

--
-- Name: daos_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.daos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.daos_id_seq OWNER TO neondb_owner;

--
-- Name: daos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.daos_id_seq OWNED BY public.daos.id;


--
-- Name: email_verification_codes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.email_verification_codes (
    id integer NOT NULL,
    email character varying NOT NULL,
    code character varying NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.email_verification_codes OWNER TO neondb_owner;

--
-- Name: email_verification_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.email_verification_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.email_verification_codes_id_seq OWNER TO neondb_owner;

--
-- Name: email_verification_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.email_verification_codes_id_seq OWNED BY public.email_verification_codes.id;


--
-- Name: governance_issues; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.governance_issues (
    id integer NOT NULL,
    title character varying NOT NULL,
    content text NOT NULL,
    proposal_link character varying,
    author_id character varying NOT NULL,
    dao_id integer,
    stance character varying NOT NULL,
    target_user_id character varying,
    target_username character varying,
    upvotes integer DEFAULT 0,
    downvotes integer DEFAULT 0,
    comment_count integer DEFAULT 0,
    champion_votes integer DEFAULT 0,
    challenge_votes integer DEFAULT 0,
    oppose_votes integer DEFAULT 0,
    is_active boolean DEFAULT true,
    activity_score integer DEFAULT 0,
    expires_at timestamp without time zone NOT NULL,
    last_activity_at timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    space_id integer,
    target_project_id integer,
    target_project_name text
);


ALTER TABLE public.governance_issues OWNER TO neondb_owner;

--
-- Name: governance_issues_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.governance_issues_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.governance_issues_id_seq OWNER TO neondb_owner;

--
-- Name: governance_issues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.governance_issues_id_seq OWNED BY public.governance_issues.id;


--
-- Name: grs_events; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.grs_events (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    change_amount integer NOT NULL,
    reason character varying NOT NULL,
    related_entity_type character varying,
    related_entity_id integer,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.grs_events OWNER TO neondb_owner;

--
-- Name: grs_events_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.grs_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.grs_events_id_seq OWNER TO neondb_owner;

--
-- Name: grs_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.grs_events_id_seq OWNED BY public.grs_events.id;


--
-- Name: invite_codes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.invite_codes (
    id integer NOT NULL,
    code character varying NOT NULL,
    created_by character varying,
    used_by character varying,
    is_used boolean DEFAULT false,
    max_uses integer DEFAULT 1,
    current_uses integer DEFAULT 0,
    expires_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    used_at timestamp without time zone,
    usage_ip_address character varying,
    usage_user_agent text,
    usage_location character varying,
    is_reward_claimed boolean DEFAULT false,
    reward_claimed_at timestamp without time zone,
    code_type character varying DEFAULT 'admin'::character varying
);


ALTER TABLE public.invite_codes OWNER TO neondb_owner;

--
-- Name: invite_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.invite_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invite_codes_id_seq OWNER TO neondb_owner;

--
-- Name: invite_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.invite_codes_id_seq OWNED BY public.invite_codes.id;


--
-- Name: invite_rewards; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.invite_rewards (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    invite_usage_id integer,
    reward_type character varying NOT NULL,
    xp_amount integer DEFAULT 0 NOT NULL,
    milestone integer,
    new_codes_generated integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT invite_rewards_reward_type_check CHECK (((reward_type)::text = ANY ((ARRAY['successful_invite'::character varying, 'milestone_bonus'::character varying])::text[])))
);


ALTER TABLE public.invite_rewards OWNER TO neondb_owner;

--
-- Name: invite_rewards_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.invite_rewards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invite_rewards_id_seq OWNER TO neondb_owner;

--
-- Name: invite_rewards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.invite_rewards_id_seq OWNED BY public.invite_rewards.id;


--
-- Name: invite_submissions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.invite_submissions (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    invite_code character varying NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    submitted_at timestamp without time zone DEFAULT now(),
    approved_at timestamp without time zone,
    notes text
);


ALTER TABLE public.invite_submissions OWNER TO neondb_owner;

--
-- Name: invite_submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.invite_submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invite_submissions_id_seq OWNER TO neondb_owner;

--
-- Name: invite_submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.invite_submissions_id_seq OWNED BY public.invite_submissions.id;


--
-- Name: invite_usage; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.invite_usage (
    id integer NOT NULL,
    invite_code_id integer NOT NULL,
    inviter_id character varying NOT NULL,
    invited_user_id character varying NOT NULL,
    ip_address character varying,
    user_agent text,
    location character varying,
    device_fingerprint character varying,
    xp_reward_given integer DEFAULT 100,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.invite_usage OWNER TO neondb_owner;

--
-- Name: invite_usage_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.invite_usage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invite_usage_id_seq OWNER TO neondb_owner;

--
-- Name: invite_usage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.invite_usage_id_seq OWNED BY public.invite_usage.id;


--
-- Name: market_positions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.market_positions (
    id integer NOT NULL,
    market_id integer NOT NULL,
    user_id character varying NOT NULL,
    outcome character varying NOT NULL,
    shares_held integer DEFAULT 0,
    average_price integer DEFAULT 0,
    total_invested integer DEFAULT 0,
    unrealized_pnl integer DEFAULT 0,
    realized_pnl integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.market_positions OWNER TO neondb_owner;

--
-- Name: market_positions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.market_positions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.market_positions_id_seq OWNER TO neondb_owner;

--
-- Name: market_positions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.market_positions_id_seq OWNED BY public.market_positions.id;


--
-- Name: market_settlements; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.market_settlements (
    id integer NOT NULL,
    market_id integer NOT NULL,
    stance_id integer NOT NULL,
    final_champion_votes integer NOT NULL,
    final_challenge_votes integer NOT NULL,
    final_oppose_votes integer NOT NULL,
    total_votes integer NOT NULL,
    winning_outcome character varying NOT NULL,
    total_payout integer DEFAULT 0,
    winning_positions integer DEFAULT 0,
    losing_positions integer DEFAULT 0,
    settled_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.market_settlements OWNER TO neondb_owner;

--
-- Name: market_settlements_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.market_settlements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.market_settlements_id_seq OWNER TO neondb_owner;

--
-- Name: market_settlements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.market_settlements_id_seq OWNED BY public.market_settlements.id;


--
-- Name: market_trades; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.market_trades (
    id integer NOT NULL,
    market_id integer NOT NULL,
    user_id character varying NOT NULL,
    outcome character varying NOT NULL,
    trade_type character varying NOT NULL,
    shares_traded integer NOT NULL,
    price_per_share integer NOT NULL,
    total_cost integer NOT NULL,
    market_price_a integer NOT NULL,
    market_price_b integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.market_trades OWNER TO neondb_owner;

--
-- Name: market_trades_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.market_trades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.market_trades_id_seq OWNER TO neondb_owner;

--
-- Name: market_trades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.market_trades_id_seq OWNED BY public.market_trades.id;


--
-- Name: notification_settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notification_settings (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    email_enabled boolean DEFAULT true,
    push_enabled boolean DEFAULT true,
    in_app_enabled boolean DEFAULT true,
    comment_notifications boolean DEFAULT true,
    vote_notifications boolean DEFAULT true,
    review_notifications boolean DEFAULT true,
    follow_notifications boolean DEFAULT true,
    achievement_notifications boolean DEFAULT true,
    system_notifications boolean DEFAULT true,
    xp_notifications boolean DEFAULT true,
    grs_notifications boolean DEFAULT true,
    weekly_digest boolean DEFAULT true,
    sound_enabled boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.notification_settings OWNER TO neondb_owner;

--
-- Name: notification_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.notification_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notification_settings_id_seq OWNER TO neondb_owner;

--
-- Name: notification_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.notification_settings_id_seq OWNED BY public.notification_settings.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    type character varying NOT NULL,
    title character varying NOT NULL,
    message text NOT NULL,
    read boolean DEFAULT false,
    action_url character varying,
    sender_id character varying,
    sender_username character varying,
    sender_avatar character varying,
    related_entity_type character varying,
    related_entity_id integer,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.notifications OWNER TO neondb_owner;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO neondb_owner;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: prediction_markets; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.prediction_markets (
    id integer NOT NULL,
    stance_id integer NOT NULL,
    market_name character varying NOT NULL,
    description text,
    outcome_a character varying DEFAULT 'COMMUNITY_SUPPORTED'::character varying NOT NULL,
    outcome_b character varying DEFAULT 'COMMUNITY_DISAGREED'::character varying NOT NULL,
    total_liquidity integer DEFAULT 1000,
    liquidity_a integer DEFAULT 500,
    liquidity_b integer DEFAULT 500,
    price_a integer DEFAULT 50,
    price_b integer DEFAULT 50,
    is_active boolean DEFAULT true,
    is_settled boolean DEFAULT false,
    winning_outcome character varying,
    total_volume integer DEFAULT 0,
    total_trades integer DEFAULT 0,
    unique_traders integer DEFAULT 0,
    settled_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.prediction_markets OWNER TO neondb_owner;

--
-- Name: prediction_markets_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.prediction_markets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prediction_markets_id_seq OWNER TO neondb_owner;

--
-- Name: prediction_markets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.prediction_markets_id_seq OWNED BY public.prediction_markets.id;


--
-- Name: project_reviews; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.project_reviews (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    project_id character varying NOT NULL,
    project_name character varying NOT NULL,
    project_logo character varying NOT NULL,
    project_slug character varying NOT NULL,
    rating integer NOT NULL,
    title character varying,
    content text NOT NULL,
    helpful integer DEFAULT 0,
    verified boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    company_reply text,
    company_replied_at timestamp without time zone
);


ALTER TABLE public.project_reviews OWNER TO neondb_owner;

--
-- Name: project_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.project_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_reviews_id_seq OWNER TO neondb_owner;

--
-- Name: project_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.project_reviews_id_seq OWNED BY public.project_reviews.id;


--
-- Name: quest_tasks; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.quest_tasks (
    id integer NOT NULL,
    quest_id integer,
    task_type character varying(50) NOT NULL,
    description text NOT NULL,
    target_value integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    target_user_id character varying,
    target_stance_id integer,
    target_dao_id integer,
    sort_order integer DEFAULT 0
);


ALTER TABLE public.quest_tasks OWNER TO neondb_owner;

--
-- Name: quest_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.quest_tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quest_tasks_id_seq OWNER TO neondb_owner;

--
-- Name: quest_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.quest_tasks_id_seq OWNED BY public.quest_tasks.id;


--
-- Name: quests; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.quests (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    quest_type character varying(20) NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    xp_reward integer,
    xp_prize_pool integer,
    max_winners integer,
    current_winners integer DEFAULT 0,
    duration_hours integer,
    xp_requirement integer,
    created_by character varying(255) DEFAULT 'system'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ends_at timestamp without time zone,
    CONSTRAINT quests_quest_type_check CHECK (((quest_type)::text = ANY ((ARRAY['starter'::character varying, 'special'::character varying, 'welcome'::character varying])::text[]))),
    CONSTRAINT quests_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'ended'::character varying])::text[])))
);


ALTER TABLE public.quests OWNER TO neondb_owner;

--
-- Name: quests_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.quests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quests_id_seq OWNER TO neondb_owner;

--
-- Name: quests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.quests_id_seq OWNED BY public.quests.id;


--
-- Name: referrals; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.referrals (
    id integer NOT NULL,
    referrer_id character varying NOT NULL,
    referred_id character varying NOT NULL,
    referral_code character varying NOT NULL,
    points_awarded integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.referrals OWNER TO neondb_owner;

--
-- Name: referrals_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.referrals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.referrals_id_seq OWNER TO neondb_owner;

--
-- Name: referrals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.referrals_id_seq OWNED BY public.referrals.id;


--
-- Name: review_comments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.review_comments (
    id integer NOT NULL,
    content text NOT NULL,
    author_id character varying NOT NULL,
    review_id integer NOT NULL,
    upvotes integer DEFAULT 0,
    downvotes integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    parent_comment_id integer
);


ALTER TABLE public.review_comments OWNER TO neondb_owner;

--
-- Name: review_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.review_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.review_comments_id_seq OWNER TO neondb_owner;

--
-- Name: review_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.review_comments_id_seq OWNED BY public.review_comments.id;


--
-- Name: review_reports; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.review_reports (
    id integer NOT NULL,
    review_id integer NOT NULL,
    reported_by character varying NOT NULL,
    reason text NOT NULL,
    status character varying DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    notes text
);


ALTER TABLE public.review_reports OWNER TO neondb_owner;

--
-- Name: review_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.review_reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.review_reports_id_seq OWNER TO neondb_owner;

--
-- Name: review_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.review_reports_id_seq OWNED BY public.review_reports.id;


--
-- Name: review_share_clicks; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.review_share_clicks (
    id integer NOT NULL,
    share_token character varying NOT NULL,
    clicked_at timestamp without time zone DEFAULT now(),
    ip_address character varying,
    user_agent character varying,
    referrer character varying,
    converted_to_user_id character varying
);


ALTER TABLE public.review_share_clicks OWNER TO neondb_owner;

--
-- Name: review_share_clicks_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.review_share_clicks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.review_share_clicks_id_seq OWNER TO neondb_owner;

--
-- Name: review_share_clicks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.review_share_clicks_id_seq OWNED BY public.review_share_clicks.id;


--
-- Name: review_shares; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.review_shares (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    review_id integer NOT NULL,
    project_id character varying NOT NULL,
    project_name character varying NOT NULL,
    project_logo character varying NOT NULL,
    share_token character varying NOT NULL,
    creda_earned integer NOT NULL,
    platform character varying DEFAULT 'twitter'::character varying,
    clicks integer DEFAULT 0,
    conversions integer DEFAULT 0,
    share_reward_claimed boolean DEFAULT false,
    share_reward_claimed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.review_shares OWNER TO neondb_owner;

--
-- Name: review_shares_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.review_shares_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.review_shares_id_seq OWNER TO neondb_owner;

--
-- Name: review_shares_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.review_shares_id_seq OWNED BY public.review_shares.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    reviewer_id character varying NOT NULL,
    reviewed_id character varying,
    reviewed_user_id character varying,
    reviewed_dao_id integer,
    target_type character varying,
    is_target_on_platform boolean DEFAULT true,
    external_entity_name text,
    external_entity_x_handle text,
    review_type character varying NOT NULL,
    rating integer,
    content text,
    points_awarded integer DEFAULT 5,
    upvotes integer DEFAULT 0,
    downvotes integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    title text,
    helpful_count integer DEFAULT 0,
    space_id integer,
    reviewed_business_id integer,
    company_reply text,
    company_replied_at timestamp without time zone
);


ALTER TABLE public.reviews OWNER TO neondb_owner;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO neondb_owner;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO neondb_owner;

--
-- Name: space_activities; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.space_activities (
    id integer NOT NULL,
    space_id integer NOT NULL,
    user_id character varying(255) NOT NULL,
    activity_type character varying(100) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.space_activities OWNER TO neondb_owner;

--
-- Name: space_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.space_activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.space_activities_id_seq OWNER TO neondb_owner;

--
-- Name: space_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.space_activities_id_seq OWNED BY public.space_activities.id;


--
-- Name: space_members; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.space_members (
    id integer NOT NULL,
    space_id integer NOT NULL,
    user_id character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'member'::character varying,
    joined_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.space_members OWNER TO neondb_owner;

--
-- Name: space_members_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.space_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.space_members_id_seq OWNER TO neondb_owner;

--
-- Name: space_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.space_members_id_seq OWNED BY public.space_members.id;


--
-- Name: space_votes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.space_votes (
    id integer NOT NULL,
    space_id integer NOT NULL,
    user_id character varying(255) NOT NULL,
    vote_type character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    comment text,
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT space_votes_vote_type_check CHECK (((vote_type)::text = ANY ((ARRAY['bullish'::character varying, 'bearish'::character varying])::text[])))
);


ALTER TABLE public.space_votes OWNER TO neondb_owner;

--
-- Name: space_votes_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.space_votes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.space_votes_id_seq OWNER TO neondb_owner;

--
-- Name: space_votes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.space_votes_id_seq OWNED BY public.space_votes.id;


--
-- Name: spaces; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.spaces (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    description text NOT NULL,
    logo_url character varying(500),
    category character varying(100),
    tags text[] DEFAULT '{}'::text[],
    is_active boolean DEFAULT true,
    is_verified boolean DEFAULT false,
    member_count integer DEFAULT 0,
    bullish_votes integer DEFAULT 0,
    bearish_votes integer DEFAULT 0,
    total_votes integer DEFAULT 0,
    view_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    created_by character varying(255),
    badge character varying,
    gradient character varying
);


ALTER TABLE public.spaces OWNER TO neondb_owner;

--
-- Name: spaces_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.spaces_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.spaces_id_seq OWNER TO neondb_owner;

--
-- Name: spaces_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.spaces_id_seq OWNED BY public.spaces.id;


--
-- Name: stance_votes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.stance_votes (
    id integer NOT NULL,
    stance_id integer NOT NULL,
    user_id character varying NOT NULL,
    vote_type character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.stance_votes OWNER TO neondb_owner;

--
-- Name: stance_votes_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.stance_votes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stance_votes_id_seq OWNER TO neondb_owner;

--
-- Name: stance_votes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.stance_votes_id_seq OWNED BY public.stance_votes.id;


--
-- Name: user_dao_follows; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_dao_follows (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    dao_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.user_dao_follows OWNER TO neondb_owner;

--
-- Name: user_dao_follows_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_dao_follows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_dao_follows_id_seq OWNER TO neondb_owner;

--
-- Name: user_dao_follows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_dao_follows_id_seq OWNED BY public.user_dao_follows.id;


--
-- Name: user_dao_scores; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_dao_scores (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    dao_id integer NOT NULL,
    score integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.user_dao_scores OWNER TO neondb_owner;

--
-- Name: user_dao_scores_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_dao_scores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_dao_scores_id_seq OWNER TO neondb_owner;

--
-- Name: user_dao_scores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_dao_scores_id_seq OWNED BY public.user_dao_scores.id;


--
-- Name: user_quest_progress; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_quest_progress (
    id integer NOT NULL,
    user_id character varying(255) NOT NULL,
    quest_id integer,
    status character varying(20) DEFAULT 'in_progress'::character varying NOT NULL,
    is_winner boolean DEFAULT false,
    reward_claimed boolean DEFAULT false,
    started_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    completed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT user_quest_progress_status_check CHECK (((status)::text = ANY (ARRAY[('not_started'::character varying)::text, ('in_progress'::character varying)::text, ('completed'::character varying)::text, ('expired'::character varying)::text])))
);


ALTER TABLE public.user_quest_progress OWNER TO neondb_owner;

--
-- Name: user_quest_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_quest_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_quest_progress_id_seq OWNER TO neondb_owner;

--
-- Name: user_quest_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_quest_progress_id_seq OWNED BY public.user_quest_progress.id;


--
-- Name: user_quest_task_progress; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_quest_task_progress (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    quest_id integer NOT NULL,
    task_id integer NOT NULL,
    current_count integer DEFAULT 0,
    target_count integer NOT NULL,
    is_completed boolean DEFAULT false,
    completed_at timestamp without time zone,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.user_quest_task_progress OWNER TO neondb_owner;

--
-- Name: user_quest_task_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_quest_task_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_quest_task_progress_id_seq OWNER TO neondb_owner;

--
-- Name: user_quest_task_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_quest_task_progress_id_seq OWNED BY public.user_quest_task_progress.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id character varying NOT NULL,
    email character varying,
    password character varying,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    username character varying,
    wallet_address character varying,
    twitter_handle character varying,
    twitter_url character varying,
    creda_points integer DEFAULT 0,
    weekly_creda integer DEFAULT 0,
    last_creda_week_reset timestamp without time zone DEFAULT now(),
    daily_streak integer DEFAULT 0,
    last_active_date timestamp without time zone,
    grs_score integer DEFAULT 1300,
    grs_percentile integer DEFAULT 0,
    email_verified boolean DEFAULT false,
    auth_provider character varying DEFAULT 'email'::character varying,
    referral_code character varying,
    has_invite_access boolean DEFAULT false,
    is_claimed boolean DEFAULT true,
    is_unclaimed_profile boolean DEFAULT false,
    claimed_at timestamp without time zone,
    created_by character varying,
    onboarding_completed_at timestamp without time zone,
    bio text,
    linkedin_url character varying,
    github_url character varying,
    discord_handle character varying,
    telegram_handle character varying,
    governance_interests text,
    profile_completed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    profile_type character varying DEFAULT 'member'::character varying,
    access_id character varying,
    full_access_activated_at timestamp with time zone,
    invite_codes_available integer DEFAULT 0,
    total_invites_sent integer DEFAULT 0,
    successful_invites integer DEFAULT 0,
    last_invite_creda_milestone integer DEFAULT 0,
    invited_by character varying,
    invite_code_used character varying,
    longest_streak integer DEFAULT 0,
    last_streak_date timestamp without time zone,
    wallet_verification_tx_hash character varying,
    is_suspended boolean DEFAULT false,
    suspended_at timestamp without time zone,
    suspension_reason text
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: votes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.votes (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    target_type character varying NOT NULL,
    target_id integer NOT NULL,
    vote_type character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.votes OWNER TO neondb_owner;

--
-- Name: votes_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.votes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.votes_id_seq OWNER TO neondb_owner;

--
-- Name: votes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.votes_id_seq OWNED BY public.votes.id;


--
-- Name: xp_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.xp_activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.xp_activities_id_seq OWNER TO neondb_owner;

--
-- Name: xp_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.xp_activities_id_seq OWNED BY public.creda_activities.id;


--
-- Name: admin_flags id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admin_flags ALTER COLUMN id SET DEFAULT nextval('public.admin_flags_id_seq'::regclass);


--
-- Name: admin_sessions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admin_sessions ALTER COLUMN id SET DEFAULT nextval('public.admin_sessions_id_seq'::regclass);


--
-- Name: business_profiles id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.business_profiles ALTER COLUMN id SET DEFAULT nextval('public.business_profiles_id_seq'::regclass);


--
-- Name: comment_votes id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.comment_votes ALTER COLUMN id SET DEFAULT nextval('public.comment_votes_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- Name: company_admins id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.company_admins ALTER COLUMN id SET DEFAULT nextval('public.company_admins_id_seq'::regclass);


--
-- Name: company_users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.company_users ALTER COLUMN id SET DEFAULT nextval('public.company_users_id_seq'::regclass);


--
-- Name: content_reports id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.content_reports ALTER COLUMN id SET DEFAULT nextval('public.content_reports_id_seq'::regclass);


--
-- Name: creda_activities id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.creda_activities ALTER COLUMN id SET DEFAULT nextval('public.xp_activities_id_seq'::regclass);


--
-- Name: daily_tasks_config id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.daily_tasks_config ALTER COLUMN id SET DEFAULT nextval('public.daily_tasks_config_id_seq'::regclass);


--
-- Name: daily_tasks_progress id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.daily_tasks_progress ALTER COLUMN id SET DEFAULT nextval('public.daily_tasks_progress_id_seq'::regclass);


--
-- Name: daos id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.daos ALTER COLUMN id SET DEFAULT nextval('public.daos_id_seq'::regclass);


--
-- Name: email_verification_codes id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.email_verification_codes ALTER COLUMN id SET DEFAULT nextval('public.email_verification_codes_id_seq'::regclass);


--
-- Name: governance_issues id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.governance_issues ALTER COLUMN id SET DEFAULT nextval('public.governance_issues_id_seq'::regclass);


--
-- Name: grs_events id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.grs_events ALTER COLUMN id SET DEFAULT nextval('public.grs_events_id_seq'::regclass);


--
-- Name: invite_codes id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invite_codes ALTER COLUMN id SET DEFAULT nextval('public.invite_codes_id_seq'::regclass);


--
-- Name: invite_rewards id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invite_rewards ALTER COLUMN id SET DEFAULT nextval('public.invite_rewards_id_seq'::regclass);


--
-- Name: invite_submissions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invite_submissions ALTER COLUMN id SET DEFAULT nextval('public.invite_submissions_id_seq'::regclass);


--
-- Name: invite_usage id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invite_usage ALTER COLUMN id SET DEFAULT nextval('public.invite_usage_id_seq'::regclass);


--
-- Name: market_positions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.market_positions ALTER COLUMN id SET DEFAULT nextval('public.market_positions_id_seq'::regclass);


--
-- Name: market_settlements id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.market_settlements ALTER COLUMN id SET DEFAULT nextval('public.market_settlements_id_seq'::regclass);


--
-- Name: market_trades id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.market_trades ALTER COLUMN id SET DEFAULT nextval('public.market_trades_id_seq'::regclass);


--
-- Name: notification_settings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification_settings ALTER COLUMN id SET DEFAULT nextval('public.notification_settings_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: prediction_markets id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.prediction_markets ALTER COLUMN id SET DEFAULT nextval('public.prediction_markets_id_seq'::regclass);


--
-- Name: project_reviews id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.project_reviews ALTER COLUMN id SET DEFAULT nextval('public.project_reviews_id_seq'::regclass);


--
-- Name: quest_tasks id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quest_tasks ALTER COLUMN id SET DEFAULT nextval('public.quest_tasks_id_seq'::regclass);


--
-- Name: quests id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quests ALTER COLUMN id SET DEFAULT nextval('public.quests_id_seq'::regclass);


--
-- Name: referrals id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.referrals ALTER COLUMN id SET DEFAULT nextval('public.referrals_id_seq'::regclass);


--
-- Name: review_comments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review_comments ALTER COLUMN id SET DEFAULT nextval('public.review_comments_id_seq'::regclass);


--
-- Name: review_reports id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review_reports ALTER COLUMN id SET DEFAULT nextval('public.review_reports_id_seq'::regclass);


--
-- Name: review_share_clicks id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review_share_clicks ALTER COLUMN id SET DEFAULT nextval('public.review_share_clicks_id_seq'::regclass);


--
-- Name: review_shares id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review_shares ALTER COLUMN id SET DEFAULT nextval('public.review_shares_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: space_activities id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.space_activities ALTER COLUMN id SET DEFAULT nextval('public.space_activities_id_seq'::regclass);


--
-- Name: space_members id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.space_members ALTER COLUMN id SET DEFAULT nextval('public.space_members_id_seq'::regclass);


--
-- Name: space_votes id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.space_votes ALTER COLUMN id SET DEFAULT nextval('public.space_votes_id_seq'::regclass);


--
-- Name: spaces id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.spaces ALTER COLUMN id SET DEFAULT nextval('public.spaces_id_seq'::regclass);


--
-- Name: stance_votes id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.stance_votes ALTER COLUMN id SET DEFAULT nextval('public.stance_votes_id_seq'::regclass);


--
-- Name: user_dao_follows id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_dao_follows ALTER COLUMN id SET DEFAULT nextval('public.user_dao_follows_id_seq'::regclass);


--
-- Name: user_dao_scores id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_dao_scores ALTER COLUMN id SET DEFAULT nextval('public.user_dao_scores_id_seq'::regclass);


--
-- Name: user_quest_progress id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_quest_progress ALTER COLUMN id SET DEFAULT nextval('public.user_quest_progress_id_seq'::regclass);


--
-- Name: user_quest_task_progress id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_quest_task_progress ALTER COLUMN id SET DEFAULT nextval('public.user_quest_task_progress_id_seq'::regclass);


--
-- Name: votes id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.votes ALTER COLUMN id SET DEFAULT nextval('public.votes_id_seq'::regclass);


--
-- Data for Name: admin_flags; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.admin_flags (id, flag_type, severity, target_user_id, target_invite_code_id, description, metadata, status, investigated_by, investigation_notes, resolved_at, created_at, investigated_at) FROM stdin;
\.


--
-- Data for Name: admin_sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.admin_sessions (id, user_id, session_token, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: business_profiles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.business_profiles (id, user_id, company_name, slug, industry, website, email, description, logo_url, plan, invite_code, is_deployed, deployed_at, total_reviews, average_rating, created_at, updated_at) FROM stdin;
1	1940567468453367808								pro	ctWZHDIGzE	t	2025-11-13 13:17:26.454	0	0	2025-11-09 00:16:23.349981	2025-11-13 13:17:26.454
\.


--
-- Data for Name: comment_votes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.comment_votes (id, comment_id, user_id, vote_type, created_at) FROM stdin;
1	17	1940567468453367808	upvote	2025-08-22 12:21:07.717296
2	16	1940567468453367808	upvote	2025-09-03 07:16:21.321153
3	33	unclaimed_1753906423772_4aedo5x3t	upvote	2025-09-05 00:10:13.98357
4	43	1940567468453367808	upvote	2025-09-07 21:21:24.218708
5	44	1940567468453367808	upvote	2025-09-07 22:16:04.560113
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.comments (id, content, author_id, issue_id, stance, upvotes, downvotes, is_early_participant, created_at, updated_at, parent_comment_id) FROM stdin;
4	Hello life is good 	1940567468453367808	5	neutral	0	0	t	2025-08-01 11:59:37.709778	2025-08-01 11:59:37.709778	\N
6	I love this easy champion	1940567468453367808	5	champion	0	0	t	2025-08-01 18:36:56.771047	2025-08-01 18:36:56.771047	\N
7	yes	1940567468453367808	5	champion	0	0	t	2025-08-01 18:37:40.805119	2025-08-01 18:37:40.805119	\N
8	Easy	unclaimed_1754350236092_z31grdc8w	6	champion	0	0	f	2025-08-04 23:58:22.856834	2025-08-04 23:58:22.856834	\N
9	hello	1940567468453367808	6	champion	0	0	f	2025-08-05 15:40:17.809932	2025-08-05 15:40:17.809932	\N
10	f rjngrjngjrngr	1940567468453367808	9	champion	0	0	t	2025-08-11 00:45:47.424681	2025-08-11 00:45:47.424681	\N
11	bhjhbhbhjbh. hbb hbbnjkn 	1940567468453367808	9	neutral	0	0	t	2025-08-11 00:46:10.846199	2025-08-11 00:46:10.846199	\N
12	hbjhbhjbhj	1953113551893073922	9	champion	0	0	t	2025-08-11 00:50:07.542692	2025-08-11 00:50:07.542692	\N
13	bhjbhjbhjbhjbhjbkjlbjkh. j 	1953113551893073922	9	neutral	0	0	t	2025-08-11 00:51:05.505325	2025-08-11 00:51:05.505325	\N
14	life is short	1943623053071765504	10	neutral	0	0	t	2025-08-11 18:39:16.502088	2025-08-11 18:39:16.502088	\N
15	amazing easy champion for me	1943623053071765504	9	champion	0	0	t	2025-08-11 18:44:15.132285	2025-08-11 18:44:15.132285	\N
17	bjhbhjbhj bhjbhbi bibiub jhbhjbih bijobiu	1940567468453367808	14	neutral	1	0	t	2025-08-22 07:32:40.573742	2025-08-22 07:32:40.573742	\N
16	bhjbjhbhj	1955002803245682690	10	champion	1	0	t	2025-08-11 21:04:20.53286	2025-08-11 21:04:20.53286	\N
18	Hello this is a test for the welcome quest	unclaimed_1753906423772_4aedo5x3t	16	neutral	0	0	t	2025-09-03 08:33:34.484191	2025-09-03 08:33:34.484191	\N
19	As it should be that’s right	unclaimed_1753906423772_4aedo5x3t	16	champion	0	0	t	2025-09-03 08:36:13.584949	2025-09-03 08:36:13.584949	\N
20	:loudspeaker: Platform Upgrade Notice @everyone @Verified \n\nHey everyone! :wave:\n\nWe’re currently rolling out some upgrades to DAO AI to bring you a smoother and more powerful experience. :rocket:\n\nDuring this time, you may notice a few interruptions or temporary downtime on the platform. Don’t worry — everything will be back shortly and better than ever. :muscle:\n\nThanks for your patience and for being part of this journey with us :pray:	1940567468453367808	24	neutral	0	0	t	2025-09-03 11:29:23.545176	2025-09-03 11:29:23.545176	\N
21	Gvgvygvgfvjgfvfgv vvgvyvytv. H g g	unclaimed_1753906423772_4aedo5x3t	25	neutral	0	0	f	2025-09-04 19:07:09.069716	2025-09-04 19:07:09.069716	\N
22	vhvghvhgvjh,vhj,vh,gjvgh,vghv. 	1940567468453367808	26	neutral	0	0	t	2025-09-04 19:32:46.650937	2025-09-04 19:32:46.650937	\N
23	hellorhbfhrbfhjrfjr rjkfrjkfr	1940567468453367808	26	neutral	0	0	t	2025-09-04 20:10:40.03275	2025-09-04 20:10:40.03275	\N
24	kjnjknjknjnjk njknjknknjk 	1940567468453367808	24	neutral	0	0	f	2025-09-04 20:11:51.430585	2025-09-04 20:11:51.430585	\N
25	Bhdbcjhbc ebchecbhr cbrjhvbcrhjv bvhfjvb f 	unclaimed_1753906423772_4aedo5x3t	25	neutral	0	0	f	2025-09-04 20:29:07.836376	2025-09-04 20:29:07.836376	\N
26	Dcgdygcdcgydg cvytvctyevctycv	unclaimed_1753906423772_4aedo5x3t	25	neutral	0	0	f	2025-09-04 21:10:10.219728	2025-09-04 21:10:10.219728	\N
27	Fhvjhvjhv,John,Jo,hjvj,have,hvhj	unclaimed_1753906423772_4aedo5x3t	25	neutral	0	0	f	2025-09-04 22:50:17.431435	2025-09-04 22:50:17.431435	\N
28	Bjhgbvghvbghvhgvghvgh	unclaimed_1753906423772_4aedo5x3t	25	neutral	0	0	f	2025-09-04 22:55:37.440386	2025-09-04 22:55:37.440386	\N
29	Bhjbhjbhnjnjknj	unclaimed_1753906423772_4aedo5x3t	25	neutral	0	0	f	2025-09-04 23:03:57.446485	2025-09-04 23:03:57.446485	\N
30	 HhhhhLife glol	unclaimed_1753906423772_4aedo5x3t	25	neutral	0	0	f	2025-09-04 23:08:23.673911	2025-09-04 23:08:23.673911	\N
31	Bkbhjbhjbjhbhjjjbjbkjbjkbjbbbbbbbb	unclaimed_1753906423772_4aedo5x3t	25	neutral	0	0	f	2025-09-04 23:45:16.077182	2025-09-04 23:45:16.077182	\N
32	Bbhjbhjbhjbhj. Hjbhjb hbhj	unclaimed_1753906423772_4aedo5x3t	25	neutral	0	0	f	2025-09-05 00:03:47.612946	2025-09-05 00:03:47.612946	\N
33	Test life 456756	unclaimed_1753906423772_4aedo5x3t	25	neutral	1	0	f	2025-09-05 00:10:00.193272	2025-09-05 00:10:00.193272	\N
34	Jhgygygy nnhkjhkbhj	unclaimed_1753906423772_4aedo5x3t	25	neutral	0	0	f	2025-09-05 00:10:28.757943	2025-09-05 00:10:28.757943	\N
35	Bhbhbhbbvhbv bb	unclaimed_1753906423772_4aedo5x3t	22	neutral	0	0	f	2025-09-05 00:11:19.155936	2025-09-05 00:11:19.155936	\N
36	Test five 4 3 45jil	unclaimed_1753906423772_4aedo5x3t	25	neutral	0	0	f	2025-09-05 00:26:07.855087	2025-09-05 00:26:07.855087	\N
37	How come I cannot see any of the expired stances they should be able to be seen\n\nTips for effective stances\n\n• Be specific and provide concrete examples\n\n• Link to original proposals when possible\n\n• Explain the potential impact of your stance\n\n• Stay professional and constructiv	unclaimed_1753906423772_4aedo5x3t	25	neutral	0	0	f	2025-09-05 00:27:03.512175	2025-09-05 00:27:03.512175	\N
38	How come I cannot see any of the expired stances they should be able to be seen\n\nTips for effective stances\n\n• Be specific and provide concrete examples\n\n• Link to original proposals when possible\n\n• Explain the potential impact of your stance\n\n• Stay professional and constructiv	unclaimed_1753906423772_4aedo5x3t	25	neutral	0	0	f	2025-09-05 01:09:50.102049	2025-09-05 01:09:50.102049	\N
39	hello how are you and when is this going to work and how will it work!! 	1940567468453367808	27	neutral	0	0	f	2025-09-06 10:24:24.340043	2025-09-06 10:24:24.340043	\N
40	Try me again	1940567468453367808	27	neutral	0	0	f	2025-09-06 10:26:12.375295	2025-09-06 10:26:12.375295	\N
41	Hello there	unclaimed_1753906423772_4aedo5x3t	30	neutral	0	0	t	2025-09-07 19:09:11.746804	2025-09-07 19:09:11.746804	\N
42	V fgvfgvfgvgfvfg	unclaimed_1753906423772_4aedo5x3t	30	neutral	0	0	t	2025-09-07 19:24:01.878664	2025-09-07 19:24:01.878664	\N
43	Gtygftyrtcrtcrt	unclaimed_1753906423772_4aedo5x3t	30	neutral	1	0	t	2025-09-07 20:00:59.397078	2025-09-07 20:00:59.397078	\N
45	I think its stupid	1940567468453367808	30	neutral	0	0	t	2025-09-07 21:22:40.671383	2025-09-07 21:22:40.671383	44
46	hello there	1940567468453367808	30	neutral	0	0	t	2025-09-07 21:36:12.177796	2025-09-07 21:36:12.177796	41
47	Dog shit	1940567468453367808	30	neutral	0	0	t	2025-09-07 21:36:33.242974	2025-09-07 21:36:33.242974	46
48	How are you	1940567468453367808	30	neutral	0	0	t	2025-09-07 22:15:50.481882	2025-09-07 22:15:50.481882	42
44	I don't agree with this view point	1940567468453367808	30	neutral	1	0	t	2025-09-07 21:22:18.008297	2025-09-07 21:22:18.008297	43
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.companies (id, external_id, name, slug, logo, description, website, email, phone, category, is_active, is_verified, created_at, updated_at, founded, key_features) FROM stdin;
1	10	KAST	kast	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	KAST is a revolutionary global money app that combines the best of traditional banking with Web3 innovation. Save, send, and spend stablecoins with a Visa-integrated card that works everywhere. Experience borderless payments with zero fees and instant settlements.	https://kast.xyz	hello@kast.xyz	\N	Cards	t	f	2025-11-16 17:20:00.958224	2025-11-17 11:24:07.732	2021	{"Visa integration","Zero fees","Instant settlements","Stablecoin savings","Global acceptance"}
2	1	MetaMask	metamask	https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&h=120&fit=crop	Most popular browser extension wallet for Ethereum and EVM chains	https://metamask.io	support@metamask.io	\N	Wallets	t	t	2025-11-18 19:49:00.248874	2025-11-18 19:49:00.248874	\N	\N
3	2	Phantom	phantom	https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=120&h=120&fit=crop	Leading Solana wallet with beautiful UI and seamless NFT support	https://phantom.app	support@phantom.app	\N	Wallets	t	t	2025-11-18 19:49:00.467773	2025-11-18 19:49:00.467773	\N	\N
4	3	Trust Wallet	trust-wallet	https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=120&h=120&fit=crop	Secure multi-chain wallet trusted by millions worldwide	https://trustwallet.com	support@trustwallet.com	\N	Wallets	t	t	2025-11-18 19:49:00.679281	2025-11-18 19:49:00.679281	\N	\N
5	4	Ledger Live	ledger-live	https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&h=120&fit=crop	Hardware wallet companion app for maximum security	https://ledger.com	support@ledger.com	\N	Wallets	t	t	2025-11-18 19:49:00.889217	2025-11-18 19:49:00.889217	\N	\N
6	5	Uniswap	uniswap	https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=120&h=120&fit=crop	Leading decentralized exchange for ERC-20 token swaps	https://uniswap.org	contact@uniswap.org	\N	Exchanges	t	t	2025-11-18 19:49:01.098731	2025-11-18 19:49:01.098731	\N	\N
7	6	Jupiter	jupiter	https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=120&h=120&fit=crop	Best liquidity aggregator on Solana with optimal routing	https://jup.ag	support@jup.ag	\N	Exchanges	t	t	2025-11-18 19:49:01.30374	2025-11-18 19:49:01.30374	\N	\N
8	7	PancakeSwap	pancakeswap	https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=120&h=120&fit=crop	Top DEX on BNB Chain with yield farming and more	https://pancakeswap.finance	hello@pancakeswap.finance	\N	Exchanges	t	t	2025-11-18 19:49:01.506339	2025-11-18 19:49:01.506339	\N	\N
9	8	Raydium	raydium	https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&h=120&fit=crop	Automated market maker and liquidity provider on Solana	https://raydium.io	support@raydium.io	\N	Exchanges	t	t	2025-11-18 19:49:01.712854	2025-11-18 19:49:01.712854	\N	\N
10	9	Coinbase Card	coinbase-card	https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=120&h=120&fit=crop	Spend crypto anywhere with cashback rewards	https://coinbase.com	card@coinbase.com	\N	Cards	t	t	2025-11-18 19:49:01.915754	2025-11-18 19:49:01.915754	\N	\N
11	11	Binance Card	binance-card	https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=120&h=120&fit=crop	Spend your crypto with zero fees and instant conversion	https://binance.com	card@binance.com	\N	Cards	t	t	2025-11-18 19:49:02.26421	2025-11-18 19:49:02.26421	\N	\N
12	12	BitPay Card	bitpay-card	https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=120&h=120&fit=crop	Convert and spend crypto in real-time with Mastercard	https://bitpay.com	support@bitpay.com	\N	Cards	t	t	2025-11-18 19:49:02.468422	2025-11-18 19:49:02.468422	\N	\N
\.


--
-- Data for Name: company_admins; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.company_admins (id, company_id, user_id, role, created_at) FROM stdin;
2	1	1940567468453367808	owner	2025-11-17 19:07:02.376626
\.


--
-- Data for Name: company_users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.company_users (id, company_id, email, password, first_name, last_name, role, is_active, last_login, created_at, updated_at) FROM stdin;
1	1	admin@kast.xyz	$2b$12$TICJyM3jL4oeg1Px1kBbVehmntw7bgxCZdgCDD9q0Pbt9w2z9Bsfe	KAST	Admin	admin	t	2025-11-18 18:28:29.366	2025-11-17 20:07:37.201738	2025-11-17 20:07:37.201738
\.


--
-- Data for Name: content_reports; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.content_reports (id, content_type, content_id, reported_by, reason, notes, status, created_at) FROM stdin;
\.


--
-- Data for Name: creda_activities; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.creda_activities (id, user_id, activity_type, creda_awarded, target_type, target_id, metadata, created_at) FROM stdin;
1	1940567468453367808	review_given	50	review	1	\N	2025-07-28 13:49:42.624199
2	1940567468453367808	review_given	25	review	1	{"rating": 5, "reviewedUsername": "daoagents"}	2025-07-28 13:49:42.887126
3	1940567468453367808	vote_cast	5	review	1	{"action": "Cast upvote vote", "voteType": "upvote"}	2025-07-28 15:27:11.377351
4	1940567468453367808	upvote_received_review	5	review	1	{"action": "Received upvote on review"}	2025-07-28 15:27:11.57784
5	1940567468453367808	review_given	50	review	4	\N	2025-07-28 16:05:50.530422
6	1940567468453367808	review_given	25	review	4	{"rating": 5, "reviewedUsername": "chaos_labs"}	2025-07-28 16:05:50.735124
7	1940567468453367808	comment_made	10	review_comment	4	\N	2025-07-28 16:31:40.509709
8	1940567468453367808	vote_cast	5	review	4	{"action": "Cast upvote vote", "voteType": "upvote"}	2025-07-28 16:35:43.497188
9	1940567468453367808	upvote_received_review	5	review	4	{"action": "Received upvote on review"}	2025-07-28 16:35:43.698992
10	1940567468453367808	comment_made	10	review_comment	4	\N	2025-07-28 16:35:56.713943
11	1940567468453367808	review_given	50	review	5	\N	2025-07-28 19:37:51.25151
12	1940567468453367808	review_given	25	review	5	{"rating": 5, "reviewedUsername": "Balancer"}	2025-07-28 19:37:51.458664
13	1940567468453367808	review_given	50	review	8	\N	2025-07-30 14:41:04.151226
14	1940567468453367808	review_given	50	review	12	\N	2025-07-30 16:43:00.962336
15	1940567468453367808	vote_cast	5	review	12	{"action": "Cast upvote vote", "voteType": "upvote"}	2025-07-30 17:32:21.472398
16	1940567468453367808	upvote_received_review	5	review	12	{"action": "Received upvote on review"}	2025-07-30 17:32:21.674422
17	1940567468453367808	review_given	50	review	13	\N	2025-07-30 17:35:21.240248
18	1940567468453367808	review_given	25	review	13	{"rating": 4, "reviewedUsername": "0ctoshi"}	2025-07-30 17:35:21.438123
19	1940567468453367808	review_given	50	review	14	{"reviewType": "positive", "targetType": "user"}	2025-07-30 20:14:57.386901
20	1940567468453367808	review_given	50	review	14	{"rating": 5, "reviewedUsername": "amandagieschen"}	2025-07-30 20:14:57.588756
21	1940567468453367808	review_given	50	review	15	{"reviewType": "positive", "targetType": "dao"}	2025-07-31 13:50:46.805951
22	1940567468453367808	review_given	50	review	15	{"rating": 5, "reviewedUsername": "kpk-io"}	2025-07-31 13:50:47.008155
23	1940567468453367808	review_given	50	review	16	{"reviewType": "positive", "targetType": "dao"}	2025-07-31 14:29:32.091136
24	1940567468453367808	review_given	50	review	16	{"rating": 5, "reviewedUsername": "testdao"}	2025-07-31 14:29:32.295663
25	1940567468453367808	review_given	50	review	17	{"reviewType": "positive", "targetType": "user"}	2025-07-31 15:43:11.443059
26	1940567468453367808	review_given	50	review	17	{"rating": 5, "reviewedUsername": "test777"}	2025-07-31 15:43:11.645069
27	1940567468453367808	review_given	50	review	18	{"reviewType": "positive", "targetType": "dao"}	2025-07-31 21:09:02.489543
28	1940567468453367808	review_given	50	review	18	{"rating": 4, "reviewedUsername": "testdao9"}	2025-07-31 21:09:02.701962
29	1940567468453367808	review_given	50	review	19	{"reviewType": "positive", "targetType": "dao"}	2025-07-31 21:25:13.941152
30	1940567468453367808	review_given	50	review	19	{"rating": 5, "reviewedUsername": "New Wave"}	2025-07-31 21:25:14.137122
31	1940567468453367808	review_given	50	review	20	{"reviewType": "negative", "targetType": "dao"}	2025-08-01 10:53:47.184703
32	1940567468453367808	review_given	50	review	21	{"reviewType": "negative", "targetType": "user"}	2025-08-01 11:18:58.37311
33	1940567468453367808	vote_cast	5	review	21	{"action": "Cast upvote vote", "voteType": "upvote"}	2025-08-01 11:24:29.948434
34	1940567468453367808	upvote_received_review	5	review	21	{"action": "Received upvote on review"}	2025-08-01 11:24:30.145157
35	1940567468453367808	review_given	50	review	22	{"reviewType": "positive", "targetType": "dao"}	2025-08-01 11:45:32.924096
36	1940567468453367808	review_given	50	review	22	{"rating": 5, "description": "Reviewed abcdao", "reviewedUsername": "abcdao"}	2025-08-01 11:45:33.126634
37	1940567468453367808	review_given	50	review	23	{"reviewType": "negative", "targetType": "user"}	2025-08-01 11:47:06.558118
38	1940567468453367808	review_given	50	review	23	{"rating": 4, "description": "Reviewed BCDDAO", "reviewedUsername": "BCDDAO"}	2025-08-01 11:47:06.756986
39	1940567468453367808	stance_created	100	governance_issue	5	{"action": "Created governance stance"}	2025-08-01 11:48:23.327165
40	1940567468453367808	normal_comment	10	comment	5	{"action": "Comment posted", "contentLength": 19}	2025-08-01 11:59:37.848027
41	1940567468453367808	stance_created	100	governance_issue	6	{"action": "Created governance stance"}	2025-08-01 14:01:25.920107
42	1940567468453367808	stance_created	100	governance_issue	7	{"action": "Created governance stance"}	2025-08-01 14:13:53.654779
43	1940567468453367808	normal_comment	10	comment	7	{"action": "Comment posted", "contentLength": 7}	2025-08-01 14:14:48.789735
44	1940567468453367808	normal_comment	10	comment	5	{"action": "Comment posted", "contentLength": 25}	2025-08-01 18:36:56.907124
45	1940567468453367808	normal_comment	10	comment	5	{"action": "Comment posted", "contentLength": 3}	2025-08-01 18:37:40.938872
46	unclaimed_1754350236092_z31grdc8w	normal_comment	10	comment	6	{"action": "Comment posted", "contentLength": 4}	2025-08-04 23:58:22.990537
47	1940567468453367808	review_comment	10	review_comment	23	{"action": "review_comment", "category": "social"}	2025-08-05 10:48:42.198462
48	1940567468453367808	review_given	50	review	24	{"reviewType": "positive", "targetType": "user"}	2025-08-05 12:42:35.757835
49	1940567468453367808	review_given	50	review	24	{"rating": 5, "description": "Reviewed DaoMasawi", "reviewedUsername": "DaoMasawi"}	2025-08-05 12:42:35.956911
50	1940567468453367808	review_given	50	review	25	{"reviewType": "positive", "targetType": "dao"}	2025-08-05 14:28:04.283664
51	1940567468453367808	review_given	50	review	25	{"rating": 5, "description": "Reviewed Arbitrum ", "reviewedUsername": "Arbitrum "}	2025-08-05 14:28:04.484337
52	1940567468453367808	vote_cast	5	review	25	{"action": "Cast upvote vote", "voteType": "upvote"}	2025-08-05 14:28:37.763065
53	1940567468453367808	upvote_received_review	5	review	25	{"action": "Received upvote on review"}	2025-08-05 14:28:37.959861
54	1940567468453367808	normal_comment	10	comment	6	{"action": "Comment posted", "contentLength": 5}	2025-08-05 15:40:17.944968
55	1940567468453367808	stance_created	100	governance_issue	8	{"action": "Created governance stance"}	2025-08-05 15:42:45.968037
56	1940567468453367808	review_given	50	review	26	{"reviewType": "positive", "targetType": "user"}	2025-08-05 21:03:16.201376
57	1940567468453367808	review_given	50	review	26	{"rating": 5, "description": "Reviewed TraverMay0909", "reviewedUsername": "TraverMay0909"}	2025-08-05 21:03:16.935905
58	1940567468453367808	review_given	50	review	27	{"reviewType": "negative", "targetType": "user"}	2025-08-06 01:28:03.159553
59	unclaimed_1754443622811_h0dewav4n	review_received	2	review	27	{"rating": 5, "reviewType": "negative", "description": "Received negative review from 1940567468453367808", "receivedFromUser": "1940567468453367808"}	2025-08-06 01:28:03.890825
60	1940567468453367808	review_given	50	review	27	{"rating": 5, "description": "Reviewed knj", "reviewedUsername": "knj"}	2025-08-06 01:28:04.088341
61	1953113551893073922	stance_created	100	governance_issue	9	{"action": "Created governance stance"}	2025-08-10 22:51:16.334733
62	1940567468453367808	vote_cast	5	stance_vote	9	{"action": "Voted champion on stance 9", "voteType": "champion"}	2025-08-11 00:45:46.597273
63	1940567468453367808	normal_comment	10	comment	9	{"action": "Comment posted", "contentLength": 15}	2025-08-11 00:45:47.561129
64	1940567468453367808	normal_comment	10	comment	9	{"action": "Comment posted", "contentLength": 25}	2025-08-11 00:46:10.988511
65	1953113551893073922	vote_cast	5	stance_vote	9	{"action": "Voted champion on stance 9", "voteType": "champion"}	2025-08-11 00:50:06.538523
66	1953113551893073922	normal_comment	10	comment	9	{"action": "Comment posted", "contentLength": 10}	2025-08-11 00:50:07.679899
67	1953113551893073922	normal_comment	10	comment	9	{"action": "Comment posted", "contentLength": 27}	2025-08-11 00:51:05.644877
68	1953113551893073922	quest_completion	525	quest	6	{"action": "quest_completion", "category": "quest"}	2025-08-11 14:22:56.251074
69	1953113551893073922	review_given	50	review	28	{"reviewType": "positive", "targetType": "user"}	2025-08-11 16:59:05.941454
70	unclaimed_1754931413976_tdkck1zod	review_received	15	review	28	{"rating": 5, "reviewType": "positive", "description": "Received positive review from 1953113551893073922", "receivedFromUser": "1953113551893073922"}	2025-08-11 16:59:07.112916
71	1953113551893073922	review_given	50	review	28	{"rating": 5, "description": "Reviewed test7777777", "reviewedUsername": "test7777777"}	2025-08-11 16:59:07.377474
72	1953113551893073922	review_given	50	review	29	{"reviewType": "positive", "targetType": "user"}	2025-08-11 17:07:51.465219
73	1940567468453367808	review_received	15	review	29	{"rating": 5, "reviewType": "positive", "description": "Received positive review from 1953113551893073922", "receivedFromUser": "1953113551893073922"}	2025-08-11 17:07:52.592686
74	1953113551893073922	review_given	50	review	29	{"rating": 5, "description": "Reviewed Masterlife_24", "reviewedUsername": "Masterlife_24"}	2025-08-11 17:07:52.85757
75	1943623053071765504	stance_created	100	governance_issue	10	{"action": "Created governance stance"}	2025-08-11 18:34:49.012303
76	1943623053071765504	normal_comment	10	comment	10	{"action": "Comment posted", "contentLength": 13}	2025-08-11 18:39:17.059955
77	1943623053071765504	review_comment	10	review_comment	29	{"action": "review_comment", "category": "social"}	2025-08-11 18:41:04.606061
78	1943623053071765504	vote_cast	5	stance_vote	9	{"action": "Voted champion on stance 9", "voteType": "champion"}	2025-08-11 18:44:14.053497
79	1943623053071765504	normal_comment	10	comment	9	{"action": "Comment posted", "contentLength": 28}	2025-08-11 18:44:15.658354
80	1943623053071765504	review_given	50	review	30	{"reviewType": "positive", "targetType": "user"}	2025-08-11 18:48:24.403888
81	unclaimed_1754334930623_nayncpsyk	review_received	15	review	30	{"rating": 5, "reviewType": "positive", "description": "Received positive review from 1943623053071765504", "receivedFromUser": "1943623053071765504"}	2025-08-11 18:48:25.83415
82	1943623053071765504	review_given	50	review	30	{"rating": 5, "description": "Reviewed DaoMasawi", "reviewedUsername": "DaoMasawi"}	2025-08-11 18:48:26.09489
83	1953113551893073922	quest_completion	525	quest	6	\N	2025-08-11 18:54:25.8035
84	1943623053071765504	review_given	50	review	31	{"reviewType": "positive", "targetType": "user"}	2025-08-11 19:02:02.669927
85	unclaimed_1753906423772_4aedo5x3t	review_received	15	review	31	{"rating": 5, "reviewType": "positive", "description": "Received positive review from 1943623053071765504", "receivedFromUser": "1943623053071765504"}	2025-08-11 19:02:04.18299
86	1943623053071765504	review_given	50	review	31	{"rating": 5, "description": "Reviewed amandagieschen", "reviewedUsername": "amandagieschen"}	2025-08-11 19:02:04.448271
88	1943623053071765504	quest_completion	525	quest	6	{"questTitle": "DAO AI Welcome Quest", "autoCompleted": true}	2025-08-11 19:18:22.488964
89	1955002803245682690	review_given	50	review	32	{"reviewType": "positive", "targetType": "user"}	2025-08-11 20:44:01.686578
90	unclaimed_1754334930623_nayncpsyk	review_received	15	review	32	{"rating": 5, "reviewType": "positive", "description": "Received positive review from 1955002803245682690", "receivedFromUser": "1955002803245682690"}	2025-08-11 20:44:02.812942
91	1955002803245682690	review_given	50	review	32	{"rating": 5, "description": "Reviewed DaoMasawi", "reviewedUsername": "DaoMasawi"}	2025-08-11 20:44:03.074588
92	1955002803245682690	vote_cast	5	stance_vote	10	{"action": "Voted champion on stance 10", "voteType": "champion"}	2025-08-11 21:04:18.637157
93	1955002803245682690	normal_comment	10	comment	10	{"action": "Comment posted", "contentLength": 9}	2025-08-11 21:04:21.657691
94	1955002803245682690	review_given	50	review	33	{"reviewType": "negative", "targetType": "user"}	2025-08-11 21:08:00.65666
95	unclaimed_1753701743381_69oe5eznf	review_received	2	review	33	{"rating": 1, "reviewType": "negative", "description": "Received negative review from 1955002803245682690", "receivedFromUser": "1955002803245682690"}	2025-08-11 21:08:02.470326
96	1955002803245682690	review_given	50	review	33	{"rating": 1, "description": "Reviewed daoagents", "reviewedUsername": "daoagents"}	2025-08-11 21:08:02.737938
97	1955002803245682690	quest_completion	525	quest	6	{"action": "quest_completion", "category": "quest"}	2025-08-11 21:10:22.264995
98	1955002803245682690	quest_completion	525	quest	6	{"action": "quest_completion", "category": "quest"}	2025-08-11 21:10:22.860357
99	1955002803245682690	stance_created	100	governance_issue	11	{"action": "Created governance stance"}	2025-08-11 21:10:23.125661
100	1940567468453367808	review_comment	10	review_comment	33	\N	2025-08-14 10:45:22.589433
101	1940567468453367808	review_comment	10	review_comment	32	\N	2025-08-14 10:46:13.953409
102	1940567468453367808	review_comment	10	review_comment	30	\N	2025-08-14 10:52:46.756871
103	1955633228036886528	review_comment	10	review_comment	32	\N	2025-08-14 11:20:13.039393
104	1955633228036886528	review_comment	10	review_comment	31	\N	2025-08-14 11:24:06.798186
105	1940567468453367808	review_comment	10	review_comment	28	\N	2025-08-14 11:38:59.635205
106	1955633228036886528	review_comment	10	review_comment	12	\N	2025-08-14 12:25:23.705811
107	1955633228036886528	stance_created	100	governance_issue	12	"{\\"action\\":\\"Created governance stance\\"}"	2025-08-14 14:23:54.032638
108	1940567468453367808	stance_created	100	governance_issue	13	"{\\"action\\":\\"Created governance stance\\"}"	2025-08-18 15:09:08.743061
109	1940567468453367808	review_given	50	review	34	"{\\"reviewType\\":\\"positive\\",\\"targetType\\":\\"user\\"}"	2025-08-18 19:20:50.709332
110	unclaimed_1755544824214_l8o9ouoxv	review_received	15	review	34	"{\\"description\\":\\"Received positive review from 1940567468453367808\\",\\"reviewType\\":\\"positive\\",\\"rating\\":5,\\"receivedFromUser\\":\\"1940567468453367808\\"}"	2025-08-18 19:20:52.115463
111	1940567468453367808	review_given	50	review	34	"{\\"description\\":\\"Reviewed xlife2\\",\\"reviewedUsername\\":\\"xlife2\\",\\"rating\\":5}"	2025-08-18 19:20:52.833069
112	1940567468453367808	stance_created	100	governance_issue	14	"{\\"action\\":\\"Created governance stance\\"}"	2025-08-22 07:32:23.475931
113	1940567468453367808	normal_comment	10	comment	14	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":41}"	2025-08-22 07:32:40.777202
114	1940567468453367808	vote_cast	5	comment	17	"{\\"action\\":\\"Cast upvote vote\\",\\"voteType\\":\\"upvote\\"}"	2025-08-22 12:21:07.863021
115	1940567468453367808	upvote_received_stance	10	governance_issue	17	"{\\"action\\":\\"Received upvote on stance\\"}"	2025-08-22 12:21:08.222066
116	1940567468453367808	stance_created	100	governance_issue	15	"{\\"action\\":\\"Created governance stance\\"}"	2025-09-02 08:44:02.84068
117	1940567468453367808	vote_cast	5	comment	16	"{\\"action\\":\\"Cast upvote vote\\",\\"voteType\\":\\"upvote\\"}"	2025-09-03 07:16:21.46209
118	1955002803245682690	upvote_received_stance	10	governance_issue	16	"{\\"action\\":\\"Received upvote on stance\\"}"	2025-09-03 07:16:22.227053
119	unclaimed_1753906423772_4aedo5x3t	onboarding_completed	25	platform	\N	"{\\"action\\":\\"Completed platform onboarding\\"}"	2025-09-03 08:30:18.76092
120	unclaimed_1753906423772_4aedo5x3t	stance_created	100	governance_issue	16	"{\\"action\\":\\"Created governance stance\\"}"	2025-09-03 08:32:39.147181
121	unclaimed_1753906423772_4aedo5x3t	normal_comment	10	comment	16	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":42}"	2025-09-03 08:33:35.645331
122	unclaimed_1753906423772_4aedo5x3t	vote_cast	5	stance_vote	16	"{\\"action\\":\\"Voted champion on stance 16\\",\\"voteType\\":\\"champion\\"}"	2025-09-03 08:36:11.307425
123	unclaimed_1753906423772_4aedo5x3t	normal_comment	10	comment	16	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":28}"	2025-09-03 08:36:14.649823
124	unclaimed_1753906423772_4aedo5x3t	review_given	50	review	35	"{\\"reviewType\\":\\"positive\\",\\"targetType\\":\\"user\\"}"	2025-09-03 08:38:48.988475
125	unclaimed_1753906423772_4aedo5x3t	quest_completion	525	quest	6	\N	2025-09-03 08:38:49.841684
126	unclaimed_1754334930623_nayncpsyk	review_received	15	review	35	"{\\"description\\":\\"Received positive review from unclaimed_1753906423772_4aedo5x3t\\",\\"reviewType\\":\\"positive\\",\\"rating\\":5,\\"receivedFromUser\\":\\"unclaimed_1753906423772_4aedo5x3t\\"}"	2025-09-03 08:38:51.52569
127	unclaimed_1753906423772_4aedo5x3t	review_given	50	review	35	"{\\"description\\":\\"Reviewed DaoMasawi\\",\\"reviewedUsername\\":\\"DaoMasawi\\",\\"rating\\":5}"	2025-09-03 08:38:52.180755
128	1940567468453367808	review_comment	10	review_comment	35	\N	2025-09-03 10:26:53.013387
129	1940567468453367808	stance_created	100	governance_issue	17	"{\\"action\\":\\"Created governance stance\\"}"	2025-09-03 10:28:39.229953
130	1940567468453367808	stance_created	100	governance_issue	18	"{\\"action\\":\\"Created governance stance\\"}"	2025-09-03 10:28:47.129724
131	1940567468453367808	stance_created	100	governance_issue	19	"{\\"action\\":\\"Created governance stance\\"}"	2025-09-03 10:29:03.307718
132	1940567468453367808	stance_created	100	governance_issue	20	"{\\"action\\":\\"Created governance stance\\"}"	2025-09-03 10:29:25.462976
133	1940567468453367808	stance_created	100	governance_issue	21	"{\\"action\\":\\"Created governance stance\\"}"	2025-09-03 10:30:30.9581
134	1940567468453367808	stance_created	100	governance_issue	22	"{\\"action\\":\\"Created governance stance\\"}"	2025-09-03 10:40:06.984
135	unclaimed_1753906423772_4aedo5x3t	review_comment	10	review_comment	35	\N	2025-09-03 10:41:53.093
136	unclaimed_1753906423772_4aedo5x3t	stance_created	100	governance_issue	23	"{\\"action\\":\\"Created governance stance\\"}"	2025-09-03 10:52:35.223
137	unclaimed_1753906423772_4aedo5x3t	stance_created	100	governance_issue	24	"{\\"action\\":\\"Created governance stance\\"}"	2025-09-03 11:05:26.459
138	unclaimed_1753906423772_4aedo5x3t	review_given	50	review	36	"{\\"reviewType\\":\\"negative\\",\\"targetType\\":\\"user\\"}"	2025-09-03 11:05:51.57
139	unclaimed_1753701743381_69oe5eznf	review_received	2	review	36	"{\\"description\\":\\"Received negative review from unclaimed_1753906423772_4aedo5x3t\\",\\"reviewType\\":\\"negative\\",\\"rating\\":5,\\"receivedFromUser\\":\\"unclaimed_1753906423772_4aedo5x3t\\"}"	2025-09-03 11:05:52.362
140	unclaimed_1753906423772_4aedo5x3t	review_given	50	review	36	"{\\"description\\":\\"Reviewed daoagents\\",\\"reviewedUsername\\":\\"daoagents\\",\\"rating\\":5}"	2025-09-03 11:05:52.558
141	unclaimed_1753906423772_4aedo5x3t	review_comment	10	review_comment	36	\N	2025-09-03 11:16:30.599
142	1940567468453367808	review_given	50	review	37	"{\\"reviewType\\":\\"neutral\\",\\"targetType\\":\\"user\\"}"	2025-09-03 11:28:36.961
143	unclaimed_1756898901215_md90l482r	review_received	5	review	37	"{\\"description\\":\\"Received neutral review from 1940567468453367808\\",\\"reviewType\\":\\"neutral\\",\\"rating\\":5,\\"receivedFromUser\\":\\"1940567468453367808\\"}"	2025-09-03 11:28:37.76
144	1940567468453367808	review_given	50	review	37	"{\\"description\\":\\"Reviewed kpk_dwdnwek\\",\\"reviewedUsername\\":\\"kpk_dwdnwek\\",\\"rating\\":5}"	2025-09-03 11:28:37.957
145	1940567468453367808	vote_cast	5	review	36	"{\\"action\\":\\"Cast upvote vote\\",\\"voteType\\":\\"upvote\\"}"	2025-09-03 11:28:45.105
146	unclaimed_1753906423772_4aedo5x3t	upvote_received_review	5	review	36	"{\\"action\\":\\"Received upvote on review\\"}"	2025-09-03 11:28:45.297
147	1940567468453367808	vote_cast	5	review	37	"{\\"action\\":\\"Cast upvote vote\\",\\"voteType\\":\\"upvote\\"}"	2025-09-03 11:28:51.229
148	1940567468453367808	upvote_received_review	5	review	37	"{\\"action\\":\\"Received upvote on review\\"}"	2025-09-03 11:28:51.426
149	1940567468453367808	quality_comment	20	comment	24	"{\\"action\\":\\"Quality comment posted\\",\\"contentLength\\":442}"	2025-09-03 11:29:23.714
150	1940567468453367808	stance_created	100	governance_issue	25	"{\\"action\\":\\"Created governance stance\\"}"	2025-09-03 11:57:57.328
151	unclaimed_1753906423772_4aedo5x3t	normal_comment	10	comment	25	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":34}"	2025-09-04 19:07:09.246
152	unclaimed_1753906423772_4aedo5x3t	stance_created	100	governance_issue	26	"{\\"action\\":\\"Created governance stance\\"}"	2025-09-04 19:08:47.025
153	1940567468453367808	normal_comment	10	comment	26	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":31}"	2025-09-04 19:32:46.822
154	unclaimed_1753906423772_4aedo5x3t	vote_cast	5	review	37	"{\\"action\\":\\"Cast upvote vote\\",\\"voteType\\":\\"upvote\\"}"	2025-09-04 19:33:54.95
155	1940567468453367808	upvote_received_review	5	review	37	"{\\"action\\":\\"Received upvote on review\\"}"	2025-09-04 19:33:55.216
156	1940567468453367808	normal_comment	10	comment	26	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":29}"	2025-09-04 20:10:40.205
157	1940567468453367808	normal_comment	10	comment	24	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":26}"	2025-09-04 20:11:51.594
158	unclaimed_1753906423772_4aedo5x3t	normal_comment	10	comment	25	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":43}"	2025-09-04 20:29:08.017
159	unclaimed_1753906423772_4aedo5x3t	normal_comment	10	comment	25	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":29}"	2025-09-04 21:10:10.394
160	unclaimed_1753906423772_4aedo5x3t	vote_cast	5	review	34	"{\\"action\\":\\"Cast upvote vote\\",\\"voteType\\":\\"upvote\\"}"	2025-09-04 21:14:36.714
161	1940567468453367808	upvote_received_review	5	review	34	"{\\"action\\":\\"Received upvote on review\\"}"	2025-09-04 21:14:36.913
162	unclaimed_1753906423772_4aedo5x3t	normal_comment	10	comment	25	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":32}"	2025-09-04 22:50:17.614
163	unclaimed_1753906423772_4aedo5x3t	normal_comment	10	comment	25	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":21}"	2025-09-04 22:55:37.633
164	unclaimed_1753906423772_4aedo5x3t	normal_comment	10	comment	25	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":15}"	2025-09-04 23:03:57.644
165	unclaimed_1753906423772_4aedo5x3t	normal_comment	10	comment	25	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":15}"	2025-09-04 23:08:23.844
166	unclaimed_1753906423772_4aedo5x3t	normal_comment	10	comment	25	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":34}"	2025-09-04 23:45:16.252
167	unclaimed_1753906423772_4aedo5x3t	normal_comment	10	comment	25	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":26}"	2025-09-05 00:03:47.785
168	unclaimed_1753906423772_4aedo5x3t	normal_comment	10	comment	25	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":16}"	2025-09-05 00:10:00.364
169	unclaimed_1753906423772_4aedo5x3t	vote_cast	5	comment	33	"{\\"action\\":\\"Cast upvote vote\\",\\"voteType\\":\\"upvote\\"}"	2025-09-05 00:10:14.083
170	unclaimed_1753906423772_4aedo5x3t	upvote_received_stance	10	governance_issue	33	"{\\"action\\":\\"Received upvote on stance\\"}"	2025-09-05 00:10:14.279
171	unclaimed_1753906423772_4aedo5x3t	normal_comment	10	comment	25	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":19}"	2025-09-05 00:10:28.927
172	unclaimed_1753906423772_4aedo5x3t	normal_comment	10	comment	22	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":15}"	2025-09-05 00:11:19.317
173	unclaimed_1753906423772_4aedo5x3t	stance_created	100	governance_issue	27	"{\\"action\\":\\"Created governance stance\\"}"	2025-09-05 00:13:40.714
174	unclaimed_1753906423772_4aedo5x3t	normal_comment	10	comment	25	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":19}"	2025-09-05 00:26:08.021
175	unclaimed_1753906423772_4aedo5x3t	quality_comment	20	comment	25	"{\\"action\\":\\"Quality comment posted\\",\\"contentLength\\":280}"	2025-09-05 00:27:03.676
176	unclaimed_1753906423772_4aedo5x3t	quality_comment	20	comment	25	"{\\"action\\":\\"Quality comment posted\\",\\"contentLength\\":280}"	2025-09-05 01:09:50.276
177	1940567468453367808	normal_comment	10	comment	27	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":72}"	2025-09-06 10:24:24.524
178	1940567468453367808	normal_comment	10	comment	27	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":12}"	2025-09-06 10:26:12.554
179	1940567468453367808	stance_created	100	governance_issue	28	"{\\"action\\":\\"Created governance stance\\"}"	2025-09-06 11:25:16.793
180	1940567468453367808	stance_created	100	governance_issue	29	"{\\"action\\":\\"Created governance stance\\"}"	2025-09-06 11:41:21.583
181	1940567468453367808	vote_cast	5	stance_vote	29	"{\\"action\\":\\"Voted champion on stance 29\\",\\"voteType\\":\\"champion\\"}"	2025-09-06 11:44:33.356
182	1940567468453367808	vote_cast	5	stance_vote	28	"{\\"action\\":\\"Voted champion on stance 28\\",\\"voteType\\":\\"champion\\"}"	2025-09-06 20:55:43.541
183	1940567468453367808	vote_cast	5	review	35	"{\\"action\\":\\"Cast upvote vote\\",\\"voteType\\":\\"upvote\\"}"	2025-09-06 21:04:18.852
184	unclaimed_1753906423772_4aedo5x3t	upvote_received_review	5	review	35	"{\\"action\\":\\"Received upvote on review\\"}"	2025-09-06 21:04:19.049
185	unclaimed_1753906423772_4aedo5x3t	vote_cast	5	stance_vote	28	"{\\"action\\":\\"Voted champion on stance 28\\",\\"voteType\\":\\"champion\\"}"	2025-09-06 21:10:28.368
186	unclaimed_1753906423772_4aedo5x3t	review_comment	10	review_comment	36	\N	2025-09-06 21:11:39.9
187	unclaimed_1753906423772_4aedo5x3t	review_given	50	review	38	"{\\"reviewType\\":\\"negative\\",\\"targetType\\":\\"user\\"}"	2025-09-06 21:12:29.062
188	1940567468453367808	review_received	2	review	38	"{\\"description\\":\\"Received negative review from unclaimed_1753906423772_4aedo5x3t\\",\\"reviewType\\":\\"negative\\",\\"rating\\":5,\\"receivedFromUser\\":\\"unclaimed_1753906423772_4aedo5x3t\\"}"	2025-09-06 21:12:29.857
189	unclaimed_1753906423772_4aedo5x3t	review_given	50	review	38	"{\\"description\\":\\"Reviewed Masterlife_24\\",\\"reviewedUsername\\":\\"Masterlife_24\\",\\"rating\\":5}"	2025-09-06 21:12:30.053
190	1940567468453367808	stance_created	100	governance_issue	30	"{\\"action\\":\\"Created governance stance\\"}"	2025-09-06 22:49:44.213
191	unclaimed_1753906423772_4aedo5x3t	stance_created	100	governance_issue	31	"{\\"action\\":\\"Created governance stance\\"}"	2025-09-06 22:55:15.193
192	unclaimed_1753906423772_4aedo5x3t	vote_cast	5	stance_vote	31	"{\\"action\\":\\"Voted champion on stance 31\\",\\"voteType\\":\\"champion\\"}"	2025-09-06 22:55:36.693
193	1940567468453367808	vote_cast	5	stance_vote	31	"{\\"action\\":\\"Voted champion on stance 31\\",\\"voteType\\":\\"champion\\"}"	2025-09-06 22:57:55.061
194	unclaimed_1753906423772_4aedo5x3t	vote_cast	5	stance_vote	30	"{\\"action\\":\\"Voted champion on stance 30\\",\\"voteType\\":\\"champion\\"}"	2025-09-06 22:58:42.063
195	unclaimed_1753906423772_4aedo5x3t	normal_comment	10	comment	30	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":11}"	2025-09-07 19:09:11.921
196	unclaimed_1753906423772_4aedo5x3t	normal_comment	10	comment	30	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":16}"	2025-09-07 19:24:02.087
197	unclaimed_1753906423772_4aedo5x3t	normal_comment	10	comment	30	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":15}"	2025-09-07 20:00:59.572
198	unclaimed_1753906423772_4aedo5x3t	stance_created	100	governance_issue	32	"{\\"action\\":\\"Created governance stance\\"}"	2025-09-07 20:02:26.623
199	1940567468453367808	vote_cast	5	comment	43	"{\\"action\\":\\"Cast upvote vote\\",\\"voteType\\":\\"upvote\\"}"	2025-09-07 21:21:24.327
200	unclaimed_1753906423772_4aedo5x3t	upvote_received_stance	10	governance_issue	43	"{\\"action\\":\\"Received upvote on stance\\"}"	2025-09-07 21:21:24.593
201	1940567468453367808	normal_comment	10	comment	30	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":34}"	2025-09-07 21:22:18.179
202	1940567468453367808	normal_comment	10	comment	30	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":18}"	2025-09-07 21:22:40.836
203	1940567468453367808	normal_comment	10	comment	30	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":11}"	2025-09-07 21:36:12.363
204	1940567468453367808	normal_comment	10	comment	30	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":8}"	2025-09-07 21:36:33.41
205	1940567468453367808	normal_comment	10	comment	30	"{\\"action\\":\\"Comment posted\\",\\"contentLength\\":11}"	2025-09-07 22:15:50.669
206	1940567468453367808	vote_cast	5	comment	44	"{\\"action\\":\\"Cast upvote vote\\",\\"voteType\\":\\"upvote\\"}"	2025-09-07 22:16:04.659
207	1940567468453367808	upvote_received_stance	10	governance_issue	44	"{\\"action\\":\\"Received upvote on stance\\"}"	2025-09-07 22:16:04.923
208	1940567468453367808	review_comment	10	review_comment	37	\N	2025-09-07 22:32:44.88
209	1940567468453367808	stance_created	100	governance_issue	33	"{\\"action\\":\\"Created governance stance\\"}"	2025-09-08 20:06:00.61
210	1940567468453367808	stance_created	100	governance_issue	34	"{\\"action\\":\\"Created governance stance\\"}"	2025-09-08 20:13:47.049
211	1940567468453367808	comment	10	governance_issue	34	\N	2025-09-15 19:31:45.24
212	1940567468453367808	comment	10	governance_issue	34	\N	2025-09-15 19:31:50.968
213	unclaimed_1754334930623_nayncpsyk	review_received	15	review	\N	{"rating": 4, "reviewType": "positive", "description": "Received positive review from 1940567468453367808", "receivedFromUser": "1940567468453367808"}	2025-09-15 19:32:53.594
214	1940567468453367808	review_given	50	review	\N	{"rating": 4, "description": "Reviewed DaoMasawi", "reviewedUsername": "DaoMasawi"}	2025-09-15 19:32:53.793
215	1940567468453367808	stance_created	100	governance_issue	35	"{\\"action\\":\\"Created governance stance\\"}"	2025-09-17 11:40:46.798
216	1940567468453367808	review_given	50	review	39	"{\\"reviewType\\":\\"positive\\",\\"targetType\\":\\"user\\"}"	2025-10-21 14:36:46.418
217	unclaimed_1761057399602_oj87lsf6d	review_received	15	review	39	"{\\"description\\":\\"Received positive review from 1940567468453367808\\",\\"reviewType\\":\\"positive\\",\\"rating\\":4,\\"receivedFromUser\\":\\"1940567468453367808\\"}"	2025-10-21 14:36:47.276
218	1940567468453367808	review_given	50	review	39	"{\\"description\\":\\"Reviewed daylight\\",\\"reviewedUsername\\":\\"daylight\\",\\"rating\\":4}"	2025-10-21 14:36:47.536
219	1940567468453367808	vote_cast	5	review	39	"{\\"action\\":\\"Cast upvote vote\\",\\"voteType\\":\\"upvote\\"}"	2025-10-21 14:38:08.918
220	1940567468453367808	upvote_received_review	5	review	39	"{\\"action\\":\\"Received upvote on review\\"}"	2025-10-21 14:38:09.183
221	1940567468453367808	review_given	50	review	40	"{\\"reviewType\\":\\"positive\\",\\"targetType\\":\\"user\\"}"	2025-10-21 20:14:10.751
222	unclaimed_1761077625620_h9olo856d	review_received	15	review	40	"{\\"description\\":\\"Received positive review from 1940567468453367808\\",\\"reviewType\\":\\"positive\\",\\"rating\\":4,\\"receivedFromUser\\":\\"1940567468453367808\\"}"	2025-10-21 20:14:11.626
223	1940567468453367808	review_given	50	review	40	"{\\"description\\":\\"Reviewed lifescan\\",\\"reviewedUsername\\":\\"lifescan\\",\\"rating\\":4}"	2025-10-21 20:14:11.892
224	1940567468453367808	review_given	50	review	41	"{\\"reviewType\\":\\"positive\\",\\"targetType\\":\\"user\\"}"	2025-10-27 18:50:23.133
225	unclaimed_1761590984358_cylskgzq6	review_received	15	review	41	"{\\"description\\":\\"Received positive review from 1940567468453367808\\",\\"reviewType\\":\\"positive\\",\\"rating\\":4,\\"receivedFromUser\\":\\"1940567468453367808\\"}"	2025-10-27 18:50:24.002
226	1940567468453367808	review_given	50	review	41	"{\\"description\\":\\"Reviewed newman2000\\",\\"reviewedUsername\\":\\"newman2000\\",\\"rating\\":4}"	2025-10-27 18:50:24.27
227	1940567468453367808	review_given	50	review	42	"{\\"reviewType\\":\\"negative\\",\\"targetType\\":\\"user\\"}"	2025-10-27 20:59:29.672
228	unclaimed_1761598725591_bwyuqfwfn	review_received	2	review	42	"{\\"description\\":\\"Received negative review from 1940567468453367808\\",\\"reviewType\\":\\"negative\\",\\"rating\\":5,\\"receivedFromUser\\":\\"1940567468453367808\\"}"	2025-10-27 20:59:30.543
229	1940567468453367808	review_given	50	review	42	"{\\"description\\":\\"Reviewed newjh\\",\\"reviewedUsername\\":\\"newjh\\",\\"rating\\":5}"	2025-10-27 20:59:30.807
230	1940567468453367808	review_given	50	review	43	"{\\"reviewType\\":\\"negative\\",\\"targetType\\":\\"user\\"}"	2025-11-01 11:21:00.817
231	unclaimed_1761996019871_w10xye861	review_received	2	review	43	"{\\"description\\":\\"Received negative review from 1940567468453367808\\",\\"reviewType\\":\\"negative\\",\\"rating\\":5,\\"receivedFromUser\\":\\"1940567468453367808\\"}"	2025-11-01 11:21:01.738
232	1940567468453367808	review_given	50	review	43	"{\\"description\\":\\"Reviewed likemike\\",\\"reviewedUsername\\":\\"likemike\\",\\"rating\\":5}"	2025-11-01 11:21:02.014
233	1940567468453367808	review_given	50	review	44	"{\\"reviewType\\":\\"negative\\",\\"targetType\\":\\"user\\"}"	2025-11-01 13:26:23.071
234	unclaimed_1762003515587_tgxl9s7dk	review_received	2	review	44	"{\\"description\\":\\"Received negative review from 1940567468453367808\\",\\"reviewType\\":\\"negative\\",\\"rating\\":4,\\"receivedFromUser\\":\\"1940567468453367808\\"}"	2025-11-01 13:26:24
235	1940567468453367808	review_given	50	review	44	"{\\"description\\":\\"Reviewed manymen\\",\\"reviewedUsername\\":\\"manymen\\",\\"rating\\":4}"	2025-11-01 13:26:24.281
236	1940567468453367808	review_given	50	review	45	"{\\"reviewType\\":\\"positive\\",\\"targetType\\":\\"user\\"}"	2025-11-07 08:18:19.833
237	unclaimed_1762503476265_91xpb7k0o	review_received	15	review	45	"{\\"description\\":\\"Received positive review from 1940567468453367808\\",\\"reviewType\\":\\"positive\\",\\"rating\\":5,\\"receivedFromUser\\":\\"1940567468453367808\\"}"	2025-11-07 08:18:20.708
238	1940567468453367808	review_given	50	review	45	"{\\"description\\":\\"Reviewed joshyeah\\",\\"reviewedUsername\\":\\"joshyeah\\",\\"rating\\":5}"	2025-11-07 08:18:20.973
239	1940567468453367808	project_review_given	50	project_review	1	"{\\"projectId\\":10,\\"projectName\\":\\"KAST\\",\\"rating\\":4}"	2025-11-16 12:21:18.191
240	1940567468453367808	project_review_given	50	project_review	2	"{\\"projectId\\":10,\\"projectName\\":\\"KAST\\",\\"rating\\":4}"	2025-11-16 12:32:45.388
241	1940567468453367808	project_review_given	50	project_review	3	"{\\"projectId\\":10,\\"projectName\\":\\"KAST\\",\\"rating\\":4}"	2025-11-16 12:39:02.622
242	1940567468453367808	project_review_given	50	project_review	4	"{\\"projectId\\":10,\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-16 12:39:51.933
243	1940567468453367808	project_review_given	50	project_review	5	"{\\"projectId\\":10,\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-16 12:40:18.113
244	1940567468453367808	project_review_given	50	project_review	6	"{\\"projectId\\":1,\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-17 11:18:59.676
245	1940567468453367808	project_review_given	50	project_review	7	"{\\"projectId\\":1,\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-17 11:21:21.033
246	1940567468453367808	project_review_given	50	project_review	8	"{\\"projectId\\":1,\\"projectName\\":\\"KAST\\",\\"rating\\":4}"	2025-11-17 11:25:27.776
247	1940567468453367808	project_review_given	50	project_review	9	"{\\"projectId\\":1,\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-17 11:33:16.017
248	1940567468453367808	project_review_given	50	project_review	10	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":3}"	2025-11-17 11:37:21.653
249	1940567468453367808	project_review_given	50	project_review	11	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-17 12:41:17.814
250	1940567468453367808	project_review_given	50	project_review	12	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":4}"	2025-11-17 12:42:46.116
251	1940567468453367808	project_review_given	50	project_review	13	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":4}"	2025-11-17 22:12:43.901
252	1940567468453367808	project_review_given	50	project_review	14	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":4}"	2025-11-18 16:54:05.644
253	1940567468453367808	stance_created	100	governance_issue	36	"{\\"action\\":\\"Created governance stance\\"}"	2025-11-19 15:25:18.198
254	1940567468453367808	project_review_given	50	project_review	15	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-20 15:25:09.511
255	1940567468453367808	project_review_given	50	project_review	16	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-20 15:28:32.657
256	1940567468453367808	project_review_given	50	project_review	17	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-20 16:49:28.422
257	1940567468453367808	project_review_given	50	project_review	18	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-20 17:10:26.017
258	1940567468453367808	project_review_given	50	project_review	19	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-20 17:29:24.151
259	1940567468453367808	project_review_given	50	project_review	20	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":4}"	2025-11-20 20:01:40.825
260	1940567468453367808	project_review_given	50	project_review	21	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-21 14:47:47.195
261	1940567468453367808	project_review_given	50	project_review	22	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-21 15:06:39.682
262	1940567468453367808	project_review_given	50	project_review	23	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-23 10:57:57.66
263	1940567468453367808	project_review_given	50	project_review	24	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-23 10:58:34.805
264	1940567468453367808	project_review_given	200	project_review	34	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-24 15:29:56.965
265	1940567468453367808	project_review_given	200	project_review	35	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-24 15:33:01.557
266	1940567468453367808	spam_report	25	review	35	"{\\"action\\":\\"Reported spam content\\",\\"contentType\\":\\"review\\",\\"contentId\\":35}"	2025-11-24 16:25:49.626
267	1940567468453367808	project_review_given	200	project_review	36	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-24 17:57:38.063
268	1940567468453367808	project_review_given	200	project_review	37	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-24 17:59:47.678
269	1940567468453367808	project_review_given	200	project_review	38	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-24 19:32:18.79
270	1940567468453367808	project_review_given	200	project_review	39	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-24 20:27:08.744
271	1940567468453367808	project_review_given	200	project_review	40	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-24 21:12:56.57
272	1940567468453367808	project_review_given	200	project_review	41	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-24 21:31:17.624
273	1940567468453367808	project_review_given	200	project_review	42	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-24 21:45:16.25
274	1940567468453367808	project_review_given	200	project_review	43	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-24 21:56:43.186
275	1940567468453367808	project_review_given	200	project_review	44	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-24 22:04:05.276
276	1940567468453367808	project_review_given	200	project_review	45	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-24 22:06:15.089
277	1940567468453367808	project_review_given	200	project_review	46	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-24 22:22:34.155
278	1940567468453367808	project_review_given	200	project_review	47	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-24 22:45:35.932
279	1940567468453367808	project_review_given	200	project_review	48	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":4}"	2025-11-25 01:03:00.879
280	1940567468453367808	project_review_given	200	project_review	49	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-25 14:11:39.815
281	1940567468453367808	project_review_given	200	project_review	50	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-25 14:18:43.019
282	1940567468453367808	project_review_given	200	project_review	51	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-25 14:44:55.126
283	1940567468453367808	project_review_given	200	project_review	52	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":4}"	2025-11-25 15:10:25.381
284	1940567468453367808	project_review_given	200	project_review	53	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":4}"	2025-11-25 15:32:06.562
285	1940567468453367808	project_review_given	200	project_review	54	"{\\"projectId\\":\\"3\\",\\"projectName\\":\\"Trust Wallet\\",\\"rating\\":4}"	2025-11-25 15:38:35.904
286	1940567468453367808	project_review_given	200	project_review	55	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-26 13:26:52.186
287	1940567468453367808	review_shared_on_x	100	review_share	7	"{\\"platform\\":\\"twitter\\",\\"projectName\\":\\"KAST\\",\\"credaEarnedFromReview\\":20}"	2025-11-26 13:27:15.857
288	1940567468453367808	project_review_given	200	project_review	56	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":5}"	2025-11-26 17:57:13.603
289	1940567468453367808	project_review_given	200	project_review	57	"{\\"projectId\\":\\"10\\",\\"projectName\\":\\"KAST\\",\\"rating\\":4}"	2025-11-26 17:57:41.791
\.


--
-- Data for Name: daily_tasks_config; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.daily_tasks_config (id, config_key, config_value, description, updated_at) FROM stdin;
1	reset_time_utc	00:00	Daily reset time in UTC (HH:MM format)	2025-08-13 23:54:35.834918
2	min_actions_for_streak	3	Minimum engagement actions required to maintain streak	2025-08-13 23:54:35.834918
\.


--
-- Data for Name: daily_tasks_progress; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.daily_tasks_progress (id, user_id, task_date, engagement_actions_completed, is_streak_eligible, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: daos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.daos (id, name, slug, description, logo_url, created_by, created_at, updated_at, twitter_handle, twitter_url, website, category, is_verified, is_unclaimed, claimed_by, claimed_at) FROM stdin;
1	Uniswap	uniswap	A decentralized trading protocol	https://cryptologos.cc/logos/uniswap-uni-logo.png	\N	2025-07-24 20:31:07.312406	2025-07-24 20:31:07.312406	Uniswap	https://x.com/Uniswap	https://uniswap.org	DeFi	f	t	\N	\N
7	Balancer	balancer	Balancer DAO community	\N	\N	2025-07-28 19:32:01.570875	2025-07-28 19:32:01.570875	Balancer	https://x.com/Balancer	https://balancer.fi	DeFi	f	t	\N	\N
2	Compound	compound	Autonomous money markets	https://cryptologos.cc/logos/compound-comp-logo.png	\N	2025-07-24 20:31:07.312406	2025-07-24 20:31:07.312406	compoundfinance	https://x.com/compoundfinance	https://compound.finance	DeFi	f	t	\N	\N
4	MakerDAO	makerdao	Decentralized credit platform	https://cryptologos.cc/logos/maker-mkr-logo.png	\N	2025-07-24 20:31:07.312406	2025-07-24 20:31:07.312406	MakerDAO	https://x.com/MakerDAO	https://makerdao.com	DeFi	f	t	\N	\N
5	Jupiter	jupiter	Solana trading aggregator	https://cryptologos.cc/logos/jupiter-jup-logo.png	\N	2025-07-24 20:31:07.312406	2025-07-24 20:31:07.312406	JupiterExchange	https://x.com/JupiterExchange	https://jup.ag	DEX	f	t	\N	\N
8	KPK DAO	kpk-io	KPK DAO DAO community	\N	1940567468453367808	2025-07-31 13:50:05.307079	2025-07-31 13:50:05.307079	kpk_io	https://x.com/kpk_io	\N	DeFi	f	t	\N	\N
9	Test DAO	testdao	Test DAO DAO community	\N	1940567468453367808	2025-07-31 14:28:53.375328	2025-07-31 14:28:53.375328	testdao	https://x.com/testdao	\N	DeFi	f	t	\N	\N
10	test DAO9	testdao9	test DAO9 DAO community	\N	1940567468453367808	2025-07-31 21:06:07.411275	2025-07-31 21:06:07.411275	testdao9	https://x.com/testdao9	\N	DeFi	f	t	\N	\N
11	New Wave	newwave	New Wave DAO community	\N	1940567468453367808	2025-07-31 21:23:17.637247	2025-07-31 21:23:17.637247	newwave	https://x.com/newwave	\N	DeFi	f	t	\N	\N
12	Lifetime test	lifetime	Lifetime test DAO community	\N	1940567468453367808	2025-08-01 10:52:59.668234	2025-08-01 10:52:59.668234	lifetime	https://x.com/lifetime	\N	DeFi	f	t	\N	\N
13	New One	newone	New One DAO community	\N	1940567468453367808	2025-08-01 11:33:29.183945	2025-08-01 11:33:29.183945	Newone	https://x.com/Newone	\N	DeFi	f	t	\N	\N
14	ABCDAO	abcdao	ABCDAO DAO community	\N	1940567468453367808	2025-08-01 11:45:18.882961	2025-08-01 11:45:18.882961	ABCDAO	https://x.com/ABCDAO	\N	DeFi	f	t	\N	\N
15	New Start	newstart	the quick brown fox jumped over the lazy dogs and became a billionaire. 		1940567468453367808	2025-08-01 13:26:49.071803	2025-08-01 13:26:49.071803	newstart	https://x.com/newstart	https://www.daoagents.io/	DeFi	f	t	\N	\N
18	Arbitrum 	arbitrum	The Arbitrum DAO is a community-driven governance mechanism that allows $ARB token holders to propose and vote on changes to the organization 	https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png	1940567468453367808	2025-08-01 17:23:06.656866	2025-08-01 17:23:06.656866	arbitrum	https://x.com/arbitrum		DeFi	f	t	\N	\N
17	stakedao	stakedao	Stake DAO is a non-custodial liquid staking platform focused on governance tokens	https://s2.coinmarketcap.com/static/img/coins/64x64/8299.png	1940567468453367808	2025-08-01 17:19:27.387241	2025-08-01 17:19:27.387241	https://x.com/StakeDAOHQ			DeFi	f	t	\N	\N
3	Aave	aave	Open source DeFi protocol	https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png	\N	2025-07-24 20:31:07.312406	2025-08-01 17:30:03.104				DeFi	f	t	\N	\N
\.


--
-- Data for Name: email_verification_codes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.email_verification_codes (id, email, code, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: governance_issues; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.governance_issues (id, title, content, proposal_link, author_id, dao_id, stance, target_user_id, target_username, upvotes, downvotes, comment_count, champion_votes, challenge_votes, oppose_votes, is_active, activity_score, expires_at, last_activity_at, created_at, updated_at, space_id, target_project_id, target_project_name) FROM stdin;
20	lol life 675	Tips for effective stances\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive		1940567468453367808	11	champion	unclaimed_1753701743381_69oe5eznf	daoagents	0	0	0	0	0	0	f	0	2025-09-05 10:29:25.288	2025-09-03 10:29:25.3243	2025-09-03 10:29:25.3243	2025-09-03 10:29:25.3243	\N	\N	\N
21	lol life 675	Tips for effective stances\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive		1940567468453367808	11	champion	unclaimed_1753701743381_69oe5eznf	daoagents	0	0	0	0	0	0	f	0	2025-09-05 10:30:30.791	2025-09-03 10:30:30.82721	2025-09-03 10:30:30.82721	2025-09-03 10:30:30.82721	\N	\N	\N
32	 B by BK John hjb	Tips for effective stances\n\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive		unclaimed_1753906423772_4aedo5x3t	4	champion	1940567468453367808	Masterlife_24	0	0	0	0	0	0	f	0	2025-09-16 21:36:45.331926	2025-09-07 20:02:26.517046	2025-09-07 20:02:26.517046	2025-09-07 20:02:26.517046	\N	\N	\N
1	Should Uniswap implement dynamic fees?	This proposal suggests implementing dynamic fee structures based on market volatility to optimize trading efficiency and provide better value for users.	\N	1940567468453367808	1	champion	\N	\N	15	3	0	12	6	0	f	0	2025-07-26 20:31:31.079995	2025-07-24 20:31:31.079995	2025-07-24 20:31:31.079995	2025-07-24 20:31:31.079995	\N	\N	\N
2	Reduce Compound protocol reserves	Proposal to reduce the protocol reserves percentage from 10% to 5% to increase rewards for lenders and borrowers in the ecosystem.	\N	1940567468453367808	2	challenge	\N	\N	32	8	0	25	15	0	f	0	2025-07-26 20:31:31.079995	2025-07-24 20:31:31.079995	2025-07-24 20:31:31.079995	2025-07-24 20:31:31.079995	\N	\N	\N
3	Expand Aave to new blockchain networks	Should Aave protocol expand to additional Layer 2 networks to reduce transaction costs and improve user accessibility?	\N	1940567468453367808	3	champion	\N	\N	87	12	0	75	24	0	f	0	2025-07-26 20:31:31.079995	2025-07-24 20:31:31.079995	2025-07-24 20:31:31.079995	2025-07-24 20:31:31.079995	\N	\N	\N
12	life is short	Tips for effective stances\n\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive		1955633228036886528	2	champion	unclaimed_1754334930623_nayncpsyk	DaoMasawi	0	0	0	0	0	0	f	0	2025-08-16 14:23:52.832396	2025-08-14 14:23:52.832396	2025-08-14 14:23:52.832396	2025-08-14 14:23:52.832396	\N	\N	\N
6	Life is crazy DAO	Tips for effective stances\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive	https://snapshot.box/#/s:cvx.eth/proposal/0x497581d7d67f9746ac801b79f38c86b4d0d7c9c81e11267519fa9eba8d584a1f	1940567468453367808	3	champion	unclaimed_1754048806293_3eppwfq0a	BCDDAO	0	0	2	2	0	0	f	6	2025-08-03 14:01:25.822917	2025-08-05 15:40:17.843	2025-08-01 14:01:25.822917	2025-08-05 15:40:17.843	\N	\N	\N
9	fjnfjkrnfjkrnf	Tips for effective stances\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive	https://snapshot.box/#/s:cvx.eth/proposal/0x497581d7d67f9746ac801b79f38c86b4d0d7c9c81e11267519fa9eba8d584a1f	1953113551893073922	18	champion	unclaimed_1754334930623_nayncpsyk	DaoMasawi	0	0	5	3	0	0	f	18	2025-08-12 22:51:16.263858	2025-08-11 18:44:15.164	2025-08-10 22:51:16.263858	2025-08-11 18:44:15.164	\N	\N	\N
13	Hubert’s Vault V2 Proposal Was a Turning Point	When this proposal from Hubert first dropped in June, it was already clear it was more than just routine governance—it was a signal of serious intent to push Stake DAO forward. \n\nFast-forward just two months, and the results are already speaking for themselves. This proposal tackled a real pain point: Stake DAO’s infrastructure was limiting growth, especially during periods of surging TVL or large deposits. \n\nHubert didn’t just highlight the issue—he delivered a comprehensive solution grounded in technical clarity and user empathy. Some of the highlights that stood out: -- Instant rewards (no more week-long delays) -- Fair exit mechanics with no lost yield -- A brand-new Accountant contract to fix reward dilution -- 90%+ reduction in harvester fees -- Smart migration strategy to avoid user disruption It’s rare to see a proposal that blends long-term protocol design, UX upgrades, and competitive positioning so seamlessly. \n\n\nAnd even rarer to see that kind of vision backed by solid execution so quickly. This is what quality governance looks like—deep understanding of the problem, thoughtful architecture, and a delivery plan that actually lands. Championing this is a no-brainer. Hubert deserves serious recognition for this contribution—not just from Stake DAO, but the broader ecosystem.	https://snapshot.box/#/s:cvx.eth/proposal/0x497581d7d67f9746ac801b79f38c86b4d0d7c9c81e11267519fa9eba8d584a1f	1940567468453367808	17	champion	unclaimed_1754334930623_nayncpsyk	DaoMasawi	0	0	0	0	0	0	f	0	2025-08-20 15:09:08.587714	2025-08-18 15:09:08.587714	2025-08-18 15:09:08.587714	2025-08-18 15:09:08.587714	\N	\N	\N
10	e fe fherjfhrf n	Tips for effective stances\n\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive		1943623053071765504	4	champion	unclaimed_1754334930623_nayncpsyk	DaoMasawi	0	0	2	1	0	0	f	7	2025-08-13 18:34:48.387904	2025-08-11 21:04:20.567	2025-08-11 18:34:48.387904	2025-08-11 21:04:20.567	\N	\N	\N
11	Google was right	Tips for effective stances\n\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive		1955002803245682690	7	champion	unclaimed_1753906423772_4aedo5x3t	amandagieschen	0	0	0	0	0	0	f	0	2025-08-13 21:10:21.12978	2025-08-11 21:10:21.12978	2025-08-11 21:10:21.12978	2025-08-11 21:10:21.12978	\N	\N	\N
4	Test Champion Stance for GRS	This is a test stance to verify GRS calculation works correctly.	\N	1940567468453367808	1	champion	unclaimed_1753701743381_69oe5eznf	daoagents	0	0	0	0	0	0	f	0	2025-07-31 21:04:01.93078	2025-07-29 21:04:01.93078	2025-07-29 21:04:01.93078	2025-07-29 21:04:01.93078	\N	\N	\N
5	NEW STANCE TEST	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	https://snapshot.box/#/s:cvx.eth/proposal/0x497581d7d67f9746ac801b79f38c86b4d0d7c9c81e11267519fa9eba8d584a1f	1940567468453367808	\N	champion	unclaimed_1754048806293_3eppwfq0a	BCDDAO	0	0	3	1	0	0	f	11	2025-08-03 11:48:23.254103	2025-08-01 18:37:40.836	2025-08-01 11:48:23.254103	2025-08-01 18:37:40.836	\N	\N	\N
8	test hushudheu 	Tips for effective stances\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive	https://snapshot.box/#/s:cvx.eth/proposal/0x497581d7d67f9746ac801b79f38c86b4d0d7c9c81e11267519fa9eba8d584a1f	1940567468453367808	18	champion	unclaimed_1754334930623_nayncpsyk	DaoMasawi	0	0	0	0	0	0	f	0	2025-08-07 15:42:45.895181	2025-08-05 15:42:45.895181	2025-08-05 15:42:45.895181	2025-08-05 15:42:45.895181	\N	\N	\N
14	nejkfnejkwfnjkewnf	Tips for effective stances\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive	https://snapshot.box/#/s:cvx.eth/proposal/0x497581d7d67f9746ac801b79f38c86b4d0d7c9c81e11267519fa9eba8d584a1f	1940567468453367808	9	champion	unclaimed_1753701743381_69oe5eznf	daoagents	0	0	1	0	0	0	f	3	2025-08-24 07:32:23.296022	2025-08-22 07:32:40.609	2025-08-22 07:32:23.296022	2025-08-22 07:32:40.609	\N	\N	\N
17	lol life 675	Tips for effective stances\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive		1940567468453367808	11	champion	1940567468453367808	Masterlife_24	0	0	0	0	0	0	f	0	2025-09-05 10:28:39.053	2025-09-03 10:28:39.089246	2025-09-03 10:28:39.089246	2025-09-03 10:28:39.089246	\N	\N	\N
16	Dhbvhjdbvhd	Tips for effective stances\n\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive		unclaimed_1753906423772_4aedo5x3t	2	champion	unclaimed_1754334930623_nayncpsyk	DaoMasawi	0	0	2	1	0	0	f	7	2025-09-05 08:32:38.043	2025-09-03 08:36:13.621	2025-09-03 08:32:38.079361	2025-09-03 08:36:13.621	\N	\N	\N
18	lol life 675	Tips for effective stances\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive		1940567468453367808	11	champion	1940567468453367808	Masterlife_24	0	0	0	0	0	0	f	0	2025-09-05 10:28:46.961	2025-09-03 10:28:46.99751	2025-09-03 10:28:46.99751	2025-09-03 10:28:46.99751	\N	\N	\N
19	lol life 675	Tips for effective stances\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive		1940567468453367808	11	champion	1940567468453367808	Masterlife_24	0	0	0	0	0	0	f	0	2025-09-05 10:29:03.137	2025-09-03 10:29:03.173892	2025-09-03 10:29:03.173892	2025-09-03 10:29:03.173892	\N	\N	\N
22	behfdbfhdv	Tips for effective stances\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive		1940567468453367808	11	champion	unclaimed_1754334930623_nayncpsyk	DaoMasawi	0	0	1	0	0	0	f	2	2025-09-05 10:40:06.847	2025-09-05 00:11:19.187	2025-09-03 10:40:06.88505	2025-09-05 00:11:19.187	\N	\N	\N
15	hekjfnkjrfnr	Tips for effective stances\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive	https://snapshot.box/#/s:cvx.eth/proposal/0x497581d7d67f9746ac801b79f38c86b4d0d7c9c81e11267519fa9eba8d584a1f	1940567468453367808	\N	champion	unclaimed_1753718596277_lxvbe0r2g	chaos_labs	0	0	0	0	0	0	f	0	2025-09-04 08:44:02.659	2025-09-02 08:44:02.696576	2025-09-02 08:44:02.696576	2025-09-02 08:44:02.696576	\N	\N	\N
33	nkjnjkebfjehdbfe	Tips for effective stances\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive	https://snapshot.box/#/s:cvx.eth/proposal/0x497581d7d67f9746ac801b79f38c86b4d0d7c9c81e11267519fa9eba8d584a1f	1940567468453367808	3	champion	1955633228036886528	JasonBand445217	0	0	0	0	0	0	f	0	2025-09-16 21:36:45.331926	2025-09-08 20:06:00.498394	2025-09-08 20:06:00.498394	2025-09-08 20:06:00.498394	\N	\N	\N
27	Rjgbjg hyegfy4fgb	Tips for effective stances\n\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive		unclaimed_1753906423772_4aedo5x3t	3	champion	1940567468453367808	Masterlife_24	0	0	2	0	0	0	f	4	2025-09-07 00:13:40.547	2025-09-06 10:26:12.418	2025-09-05 00:13:40.583109	2025-09-06 10:26:12.418	\N	\N	\N
26	Bhjbhjbhjbnhjnjhn 	Tips for effective stances\n\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive		unclaimed_1753906423772_4aedo5x3t	4	champion	1940567468453367808	Masterlife_24	0	0	2	0	0	0	f	6	2025-09-06 19:08:46.887	2025-09-04 20:10:40.073	2025-09-04 19:08:46.923076	2025-09-04 20:10:40.073	\N	\N	\N
29	fjknrfjkrnfj	Tips for effective stances\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive		1940567468453367808	10	champion	unclaimed_1753906423772_4aedo5x3t	amandagieschen	0	0	0	1	0	0	f	1	2025-09-08 11:41:21.433	2025-09-06 11:41:21.471066	2025-09-06 11:41:21.471066	2025-09-06 11:44:33.224	\N	\N	\N
23	Testing ejkfnrjkefnr	Tips for effective stances\n\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive		unclaimed_1753906423772_4aedo5x3t	2	champion	unclaimed_1753906423772_4aedo5x3t	amandagieschen	0	0	0	0	0	0	f	0	2025-09-05 10:52:35.066	2025-09-03 10:52:35.103772	2025-09-03 10:52:35.103772	2025-09-03 10:52:35.103772	\N	\N	\N
24	Rbgkjrgrgbrtegb	Tips for effective stances\n\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive		unclaimed_1753906423772_4aedo5x3t	11	champion	unclaimed_1754048806293_3eppwfq0a	BCDDAO	0	0	2	0	0	0	f	5	2025-09-05 11:05:26.315	2025-09-04 20:11:51.462	2025-09-03 11:05:26.351547	2025-09-04 20:11:51.462	\N	\N	\N
25	jnfgrjkgnfrg	How come I cannot see any of the expired stances they should be able to be seen\n\nTips for effective stances\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructiv		1940567468453367808	2	challenge	unclaimed_1754048806293_3eppwfq0a	BCDDAO	0	0	14	0	0	0	f	28	2025-09-05 11:57:57.187	2025-09-05 01:09:50.144	2025-09-03 11:57:57.224014	2025-09-05 01:09:50.144	\N	\N	\N
30	djjdfnejf kjnjnj	Tips for effective stances\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive	https://snapshot.box/#/s:cvx.eth/proposal/0x497581d7d67f9746ac801b79f38c86b4d0d7c9c81e11267519fa9eba8d584a1f	1940567468453367808	2	champion	unclaimed_1754334930623_nayncpsyk	DaoMasawi	0	0	8	1	0	0	f	25	2025-09-08 22:49:44.031	2025-09-07 22:15:50.53	2025-09-06 22:49:44.06863	2025-09-07 22:15:50.53	\N	\N	\N
34	jjjnejnkmknknknk	Tips for effective stances\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive	https://snapshot.box/#/s:cvx.eth/proposal/0x497581d7d67f9746ac801b79f38c86b4d0d7c9c81e11267519fa9eba8d584a1f	1940567468453367808	14	champion	unclaimed_1754350236092_z31grdc8w	TraverMay0909	0	0	0	0	0	0	f	0	2025-09-16 21:36:45.331926	2025-09-08 20:13:46.938463	2025-09-08 20:13:46.938463	2025-09-08 20:13:46.938463	\N	\N	\N
36	bhjbhjbhjbhbjhbhj	bhjbjhbjh bhbyubyu hjbhjbuybyu uygtyghjknfghbjfgvhbjgjvhb 		1940567468453367808	\N	champion	\N	\N	0	0	0	0	0	0	f	0	2025-11-21 15:25:18.045	2025-11-19 15:25:18.082917	2025-11-19 15:25:18.082917	2025-11-19 15:25:18.082917	\N	1	KAST
28	nejkfnejkwfnewjf	Tips for effective stances\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive		1940567468453367808	11	champion	unclaimed_1753906423772_4aedo5x3t	amandagieschen	0	0	0	2	0	0	f	2	2025-09-08 11:25:16.617	2025-09-06 11:25:16.653723	2025-09-06 11:25:16.653723	2025-09-06 21:10:28.237	\N	\N	\N
31	Djknjkvnrfjrv dvdjv	Tips for effective stances\n\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive		unclaimed_1753906423772_4aedo5x3t	7	champion	unclaimed_1754048806293_3eppwfq0a	BCDDAO	0	0	0	2	0	0	f	2	2025-09-08 22:55:15.048	2025-09-06 22:55:15.084478	2025-09-06 22:55:15.084478	2025-09-06 22:57:54.931	\N	\N	\N
35	ehbfdhjebfhj	fehfbehbfherbf bfewbfhjewbf fbejkwferw fhjerw fjeirh fewruf	https://snapshot.box/#/s:cvx.eth/proposal/0x497581d7d67f9746ac801b79f38c86b4d0d7c9c81e11267519fa9eba8d584a1f	1940567468453367808	7	champion	unclaimed_1753701743381_69oe5eznf	daoagents	0	0	0	0	0	0	f	0	2025-09-19 11:40:46.645	2025-09-17 11:40:46.691417	2025-09-17 11:40:46.691417	2025-09-17 11:40:46.691417	\N	\N	\N
\.


--
-- Data for Name: grs_events; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.grs_events (id, user_id, change_amount, reason, related_entity_type, related_entity_id, metadata, created_at) FROM stdin;
1	1940567468453367808	250	stance_success	stance	4	"{\\"stanceType\\":\\"champion\\",\\"winningVote\\":\\"champion\\",\\"success\\":true}"	2025-07-29 21:04:26.73868
2	unclaimed_1753701743381_69oe5eznf	180	stance_target_champion_success	stance	4	"{\\"championed\\":true,\\"communitySupport\\":true}"	2025-07-29 21:04:27.217909
3	1940567468453367808	50	voter_accountability_correct	vote	1	"{\\"stanceId\\":4,\\"voteType\\":\\"champion\\",\\"wasCorrect\\":true}"	2025-07-29 21:04:27.69025
4	unclaimed_1753701743381_69oe5eznf	-30	voter_accountability_incorrect	vote	2	"{\\"stanceId\\":4,\\"voteType\\":\\"oppose\\",\\"wasCorrect\\":false}"	2025-07-29 21:04:28.156272
5	unclaimed_1753718596277_lxvbe0r2g	50	voter_accountability_correct	vote	3	"{\\"stanceId\\":4,\\"voteType\\":\\"champion\\",\\"wasCorrect\\":true}"	2025-07-29 21:04:28.620368
6	unclaimed_1754350236092_z31grdc8w	25	review_received_positive_high_grs	review	26	"{\\"reviewType\\":\\"positive\\",\\"reviewerGrs\\":1863,\\"reviewerId\\":\\"1940567468453367808\\"}"	2025-08-05 21:03:16.604575
7	unclaimed_1754443622811_h0dewav4n	-15	review_received_negative_high_grs	review	27	"{\\"reviewType\\":\\"negative\\",\\"reviewerGrs\\":1863,\\"reviewerId\\":\\"1940567468453367808\\"}"	2025-08-06 01:28:03.561515
8	1940567468453367808	250	stance_success	stance	5	"{\\"stanceType\\":\\"champion\\",\\"winningVote\\":\\"champion\\",\\"success\\":true}"	2025-08-08 12:03:14.729525
9	unclaimed_1754048806293_3eppwfq0a	30	stance_target_champion_success	stance	5	"{\\"championed\\":true,\\"communitySupport\\":true}"	2025-08-08 12:03:15.200897
10	1940567468453367808	8	voter_accountability_correct	vote	5	"{\\"stanceId\\":5,\\"voteType\\":\\"champion\\",\\"wasCorrect\\":true}"	2025-08-08 12:03:15.659548
11	1940567468453367808	250	stance_success	stance	6	"{\\"stanceType\\":\\"champion\\",\\"winningVote\\":\\"champion\\",\\"success\\":true}"	2025-08-08 14:02:11.196637
12	unclaimed_1754048806293_3eppwfq0a	30	stance_target_champion_success	stance	6	"{\\"championed\\":true,\\"communitySupport\\":true}"	2025-08-08 14:02:11.667949
13	unclaimed_1754350236092_z31grdc8w	8	voter_accountability_correct	vote	6	"{\\"stanceId\\":6,\\"voteType\\":\\"champion\\",\\"wasCorrect\\":true}"	2025-08-08 14:02:12.127451
14	1940567468453367808	8	voter_accountability_correct	vote	7	"{\\"stanceId\\":6,\\"voteType\\":\\"champion\\",\\"wasCorrect\\":true}"	2025-08-08 14:02:12.587178
15	unclaimed_1754931413976_tdkck1zod	15	review_received_positive_medium_grs	review	28	"{\\"reviewType\\":\\"positive\\",\\"reviewerGrs\\":1300,\\"reviewerId\\":\\"1953113551893073922\\"}"	2025-08-11 16:59:06.779887
16	1940567468453367808	15	review_received_positive_medium_grs	review	29	"{\\"reviewType\\":\\"positive\\",\\"reviewerGrs\\":1300,\\"reviewerId\\":\\"1953113551893073922\\"}"	2025-08-11 17:07:52.2579
17	unclaimed_1754334930623_nayncpsyk	15	review_received_positive_medium_grs	review	30	"{\\"reviewType\\":\\"positive\\",\\"reviewerGrs\\":1300,\\"reviewerId\\":\\"1943623053071765504\\"}"	2025-08-11 18:48:25.506843
18	unclaimed_1753906423772_4aedo5x3t	15	review_received_positive_medium_grs	review	31	"{\\"reviewType\\":\\"positive\\",\\"reviewerGrs\\":1300,\\"reviewerId\\":\\"1943623053071765504\\"}"	2025-08-11 19:02:03.846164
19	unclaimed_1754334930623_nayncpsyk	15	review_received_positive_medium_grs	review	32	"{\\"reviewType\\":\\"positive\\",\\"reviewerGrs\\":1300,\\"reviewerId\\":\\"1955002803245682690\\"}"	2025-08-11 20:44:02.480124
20	unclaimed_1753701743381_69oe5eznf	-10	review_received_negative_medium_grs	review	33	"{\\"reviewType\\":\\"negative\\",\\"reviewerGrs\\":1300,\\"reviewerId\\":\\"1955002803245682690\\"}"	2025-08-11 21:08:02.132194
21	1953113551893073922	250	stance_success	stance	9	"{\\"stanceType\\":\\"champion\\",\\"winningVote\\":\\"champion\\",\\"success\\":true}"	2025-08-18 13:12:26.694156
22	unclaimed_1754334930623_nayncpsyk	30	stance_target_champion_success	stance	9	"{\\"championed\\":true,\\"communitySupport\\":true}"	2025-08-18 13:12:27.20185
23	1940567468453367808	8	voter_accountability_correct	vote	8	"{\\"stanceId\\":9,\\"voteType\\":\\"champion\\",\\"wasCorrect\\":true}"	2025-08-18 13:12:27.693469
24	1953113551893073922	8	voter_accountability_correct	vote	9	"{\\"stanceId\\":9,\\"voteType\\":\\"champion\\",\\"wasCorrect\\":true}"	2025-08-18 13:12:28.182849
25	1943623053071765504	8	voter_accountability_correct	vote	10	"{\\"stanceId\\":9,\\"voteType\\":\\"champion\\",\\"wasCorrect\\":true}"	2025-08-18 13:12:28.674858
26	1943623053071765504	250	stance_success	stance	10	"{\\"stanceType\\":\\"champion\\",\\"winningVote\\":\\"champion\\",\\"success\\":true}"	2025-08-18 18:39:30.252579
27	unclaimed_1754334930623_nayncpsyk	30	stance_target_champion_success	stance	10	"{\\"championed\\":true,\\"communitySupport\\":true}"	2025-08-18 18:39:30.775555
28	1955002803245682690	8	voter_accountability_correct	vote	11	"{\\"stanceId\\":10,\\"voteType\\":\\"champion\\",\\"wasCorrect\\":true}"	2025-08-18 18:39:31.252347
29	unclaimed_1755544824214_l8o9ouoxv	25	review_received_positive_high_grs	review	34	"{\\"reviewType\\":\\"positive\\",\\"reviewerGrs\\":2402,\\"reviewerId\\":\\"1940567468453367808\\"}"	2025-08-18 19:20:51.757957
30	unclaimed_1754334930623_nayncpsyk	15	review_received_positive_medium_grs	review	35	"{\\"reviewType\\":\\"positive\\",\\"reviewerGrs\\":1315,\\"reviewerId\\":\\"unclaimed_1753906423772_4aedo5x3t\\"}"	2025-09-03 08:38:51.182555
31	unclaimed_1753701743381_69oe5eznf	-10	review_received_negative_medium_grs	review	36	"{\\"reviewType\\":\\"negative\\",\\"reviewerGrs\\":1315,\\"reviewerId\\":\\"unclaimed_1753906423772_4aedo5x3t\\"}"	2025-09-03 11:05:52.067614
32	unclaimed_1756898901215_md90l482r	3	review_received_neutral	review	37	"{\\"reviewType\\":\\"neutral\\",\\"reviewerGrs\\":2402,\\"reviewerId\\":\\"1940567468453367808\\"}"	2025-09-03 11:28:37.463877
33	unclaimed_1753906423772_4aedo5x3t	250	stance_success	stance	16	"{\\"stanceType\\":\\"champion\\",\\"winningVote\\":\\"champion\\",\\"success\\":true}"	2025-09-05 09:03:56.510519
34	unclaimed_1754334930623_nayncpsyk	30	stance_target_champion_success	stance	16	"{\\"championed\\":true,\\"communitySupport\\":true}"	2025-09-05 09:03:56.983328
35	unclaimed_1753906423772_4aedo5x3t	8	voter_accountability_correct	vote	12	"{\\"stanceId\\":16,\\"voteType\\":\\"champion\\",\\"wasCorrect\\":true}"	2025-09-05 09:03:57.453993
36	1940567468453367808	-10	review_received_negative_medium_grs	review	38	"{\\"reviewType\\":\\"negative\\",\\"reviewerGrs\\":1573,\\"reviewerId\\":\\"unclaimed_1753906423772_4aedo5x3t\\"}"	2025-09-06 21:12:29.562681
37	1940567468453367808	250	stance_success	stance	28	"{\\"stanceType\\":\\"champion\\",\\"winningVote\\":\\"champion\\",\\"success\\":true}"	2025-09-08 11:31:41.86342
38	unclaimed_1753906423772_4aedo5x3t	30	stance_target_champion_success	stance	28	"{\\"championed\\":true,\\"communitySupport\\":true}"	2025-09-08 11:31:42.326407
39	1940567468453367808	8	voter_accountability_correct	vote	14	"{\\"stanceId\\":28,\\"voteType\\":\\"champion\\",\\"wasCorrect\\":true}"	2025-09-08 11:31:42.77951
40	unclaimed_1753906423772_4aedo5x3t	8	voter_accountability_correct	vote	15	"{\\"stanceId\\":28,\\"voteType\\":\\"champion\\",\\"wasCorrect\\":true}"	2025-09-08 11:31:43.230322
41	1940567468453367808	250	stance_success	stance	29	"{\\"stanceType\\":\\"champion\\",\\"winningVote\\":\\"champion\\",\\"success\\":true}"	2025-09-08 11:41:41.926139
42	unclaimed_1753906423772_4aedo5x3t	30	stance_target_champion_success	stance	29	"{\\"championed\\":true,\\"communitySupport\\":true}"	2025-09-08 11:41:42.40463
43	1940567468453367808	8	voter_accountability_correct	vote	13	"{\\"stanceId\\":29,\\"voteType\\":\\"champion\\",\\"wasCorrect\\":true}"	2025-09-08 11:41:42.871364
44	1940567468453367808	250	stance_success	stance	30	"{\\"stanceType\\":\\"champion\\",\\"winningVote\\":\\"champion\\",\\"success\\":true}"	2025-09-08 22:50:35.342901
45	unclaimed_1754334930623_nayncpsyk	30	stance_target_champion_success	stance	30	"{\\"championed\\":true,\\"communitySupport\\":true}"	2025-09-08 22:50:35.808475
46	unclaimed_1753906423772_4aedo5x3t	8	voter_accountability_correct	vote	18	"{\\"stanceId\\":30,\\"voteType\\":\\"champion\\",\\"wasCorrect\\":true}"	2025-09-08 22:50:36.26002
47	unclaimed_1753906423772_4aedo5x3t	250	stance_success	stance	31	"{\\"stanceType\\":\\"champion\\",\\"winningVote\\":\\"champion\\",\\"success\\":true}"	2025-09-08 22:55:37.403694
48	unclaimed_1754048806293_3eppwfq0a	30	stance_target_champion_success	stance	31	"{\\"championed\\":true,\\"communitySupport\\":true}"	2025-09-08 22:55:37.877831
49	unclaimed_1753906423772_4aedo5x3t	8	voter_accountability_correct	vote	16	"{\\"stanceId\\":31,\\"voteType\\":\\"champion\\",\\"wasCorrect\\":true}"	2025-09-08 22:55:38.334996
50	1940567468453367808	8	voter_accountability_correct	vote	17	"{\\"stanceId\\":31,\\"voteType\\":\\"champion\\",\\"wasCorrect\\":true}"	2025-09-08 22:55:38.792629
51	unclaimed_1753906423772_4aedo5x3t	-50	review_accuracy_negative_incorrect	review	38	"{\\"reviewType\\":\\"negative\\",\\"reviewedUserId\\":\\"1940567468453367808\\",\\"grsChangeOfTarget\\":764,\\"reviewAccuracy\\":\\"incorrect\\"}"	2025-09-13 02:00:33.586641
52	unclaimed_1761057399602_oj87lsf6d	25	review_received_positive_high_grs	review	39	"{\\"reviewType\\":\\"positive\\",\\"reviewerGrs\\":2800,\\"reviewerId\\":\\"1940567468453367808\\"}"	2025-10-21 14:36:46.981137
53	unclaimed_1761077625620_h9olo856d	25	review_received_positive_high_grs	review	40	"{\\"reviewType\\":\\"positive\\",\\"reviewerGrs\\":2800,\\"reviewerId\\":\\"1940567468453367808\\"}"	2025-10-21 20:14:11.325445
54	unclaimed_1761590984358_cylskgzq6	25	review_received_positive_high_grs	review	41	"{\\"reviewType\\":\\"positive\\",\\"reviewerGrs\\":2800,\\"reviewerId\\":\\"1940567468453367808\\"}"	2025-10-27 18:50:23.703455
55	unclaimed_1761598725591_bwyuqfwfn	-15	review_received_negative_high_grs	review	42	"{\\"reviewType\\":\\"negative\\",\\"reviewerGrs\\":2800,\\"reviewerId\\":\\"1940567468453367808\\"}"	2025-10-27 20:59:30.245792
56	unclaimed_1761996019871_w10xye861	-15	review_received_negative_high_grs	review	43	"{\\"reviewType\\":\\"negative\\",\\"reviewerGrs\\":2800,\\"reviewerId\\":\\"1940567468453367808\\"}"	2025-11-01 11:21:01.423052
57	unclaimed_1762003515587_tgxl9s7dk	-15	review_received_negative_high_grs	review	44	"{\\"reviewType\\":\\"negative\\",\\"reviewerGrs\\":2800,\\"reviewerId\\":\\"1940567468453367808\\"}"	2025-11-01 13:26:23.672242
58	unclaimed_1762503476265_91xpb7k0o	25	review_received_positive_high_grs	review	45	"{\\"reviewType\\":\\"positive\\",\\"reviewerGrs\\":2800,\\"reviewerId\\":\\"1940567468453367808\\"}"	2025-11-07 08:18:20.410633
\.


--
-- Data for Name: invite_codes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.invite_codes (id, code, created_by, used_by, is_used, max_uses, current_uses, expires_at, created_at, used_at, usage_ip_address, usage_user_agent, usage_location, is_reward_claimed, reward_claimed_at, code_type) FROM stdin;
363	XR9MA8BJ	1955633228036886528	\N	f	1	0	\N	2025-08-14 01:15:44.875177	\N	\N	\N	\N	f	\N	user
365	YWCXOK7M	1955633228036886528	\N	f	1	0	\N	2025-08-14 01:15:44.964911	\N	\N	\N	\N	f	\N	user
366	L1YA8X9N	1955633228036886528	\N	f	1	0	\N	2025-08-14 01:15:45.031954	\N	\N	\N	\N	f	\N	user
362	4X9KUJF1	1955633228036886528	\N	f	1	0	\N	2025-08-14 01:15:44.874883	\N	\N	\N	\N	f	\N	user
364	HBFWBUXD	1955633228036886528	\N	f	1	0	\N	2025-08-14 01:15:44.963704	\N	\N	\N	\N	f	\N	user
367	ZZSY4JL7	1955633228036886528	\N	f	1	0	\N	2025-08-14 01:15:45.032451	\N	\N	\N	\N	f	\N	user
301	99515IA8	unclaimed_1753896873146_gnsrpgoq5	\N	f	1	0	\N	2025-08-12 20:59:28.486405	\N	\N	\N	\N	f	\N	user
302	6H9ZHTRD	unclaimed_1753896873146_gnsrpgoq5	\N	f	1	0	\N	2025-08-12 20:59:28.567789	\N	\N	\N	\N	f	\N	user
303	T789TLHX	unclaimed_1753896873146_gnsrpgoq5	\N	f	1	0	\N	2025-08-12 20:59:28.637373	\N	\N	\N	\N	f	\N	user
304	7C0MSQLK	1953113551893073922	\N	f	1	0	\N	2025-08-12 20:59:28.775281	\N	\N	\N	\N	f	\N	user
305	ST402ORQ	1953113551893073922	\N	f	1	0	\N	2025-08-12 20:59:28.843443	\N	\N	\N	\N	f	\N	user
306	1CY2XHYQ	1953113551893073922	\N	f	1	0	\N	2025-08-12 20:59:28.911705	\N	\N	\N	\N	f	\N	user
1	08HB-CB0P-1N2D-6QJC	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
2	9KDW-JVNS-97B0-YEEX	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
3	NXMP-ZNF0-CVZC-7SAL	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
4	FWKA-7HU7-LU94-BMRO	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
5	1CNI-HP8T-95N6-QAWP	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
6	7EDI-8HEL-AHHX-LSOO	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
7	5IB2-DD5A-I3TU-4SSC	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
307	7HY7TYE8	unclaimed_1753976411439_e6jc6s5w5	\N	f	1	0	\N	2025-08-12 20:59:29.047021	\N	\N	\N	\N	f	\N	user
308	M5YFBJEV	unclaimed_1753976411439_e6jc6s5w5	\N	f	1	0	\N	2025-08-12 20:59:29.115855	\N	\N	\N	\N	f	\N	user
309	TVDAKPPV	unclaimed_1753976411439_e6jc6s5w5	\N	f	1	0	\N	2025-08-12 20:59:29.183124	\N	\N	\N	\N	f	\N	user
310	VBLD1WNR	unclaimed_1754047107989_jorwaa1d2	\N	f	1	0	\N	2025-08-12 20:59:29.319392	\N	\N	\N	\N	f	\N	user
311	C8QI3ENJ	unclaimed_1754047107989_jorwaa1d2	\N	f	1	0	\N	2025-08-12 20:59:29.388164	\N	\N	\N	\N	f	\N	user
312	XXBI3D89	unclaimed_1754047107989_jorwaa1d2	\N	f	1	0	\N	2025-08-12 20:59:29.456578	\N	\N	\N	\N	f	\N	user
313	AO2QLMHA	unclaimed_1753701743381_69oe5eznf	\N	f	1	0	\N	2025-08-12 20:59:29.593553	\N	\N	\N	\N	f	\N	user
314	PG17EOUZ	unclaimed_1753701743381_69oe5eznf	\N	f	1	0	\N	2025-08-12 20:59:29.661981	\N	\N	\N	\N	f	\N	user
315	3W7ZDOQI	unclaimed_1753701743381_69oe5eznf	\N	f	1	0	\N	2025-08-12 20:59:29.729027	\N	\N	\N	\N	f	\N	user
316	T3MWI2W9	unclaimed_1753893705381_eeppyn035	\N	f	1	0	\N	2025-08-12 20:59:29.864507	\N	\N	\N	\N	f	\N	user
317	564W3E8Y	unclaimed_1753893705381_eeppyn035	\N	f	1	0	\N	2025-08-12 20:59:29.932474	\N	\N	\N	\N	f	\N	user
8	2WOT-RLRI-FBS1-5SJZ	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
9	4SF2-0ZPZ-28NJ-7XGK	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
10	AH79-CL76-CTBT-XNQS	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
11	3TGQ-05Q1-YNK1-AD8Q	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
12	OYC3-710R-JYUX-UIZX	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
13	B0D5-7XF1-ZB0T-U9NJ	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
14	KVEH-F7FQ-F1B0-SY0X	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
15	M7PR-PRQW-N4T0-1SKI	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
16	Z2A0-M9OF-L7YC-VMZD	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
17	GGCO-Z7IH-ASVJ-VIM1	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
18	XBCE-3GT0-ICTR-KOBX	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
19	0B89-2CH9-6VD3-Z8IW	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
20	A9VX-SAT7-UHC1-ZATX	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
21	F1RB-TF8N-IZ1C-XBIN	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
22	GRWQ-EUCY-E0GX-S9SX	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
23	RRHV-TLF5-FWDZ-H8BI	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
24	CPIJ-NW26-RBPZ-2EVO	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
25	0Q9U-72HL-57QH-8A48	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
26	JIFZ-C6X5-YW1V-SEKY	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
27	XX6T-AUJ9-BQE5-A2LR	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
28	QKIH-HARN-70EE-F36I	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
29	2ICM-VZS3-18NF-D5PK	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
30	ZGBN-P7RK-EP01-VN7W	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
31	G2OH-LLN7-66FB-ZILP	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
32	G9EV-NI9C-11LS-LX3F	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
33	EBK4-I76V-BS5Z-EK2R	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
34	RJD2-KBC5-W1CW-REYA	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
35	3XRZ-SB7L-7BJW-VC7X	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
36	K7QS-JWSG-62KB-EUCN	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
37	2Z3B-MYTR-XM3Q-20FO	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
38	BO6C-AYPK-36J2-M6EA	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
39	2UH4-K9U8-FOLN-LBII	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
40	9Q5H-Y1U4-1WMR-EWVR	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
41	5XKA-VO6V-3125-PCQH	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
42	0GI8-VVWA-C0VT-2D2U	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
43	6JMU-CYKQ-AJCM-C8RO	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
44	7J6O-GLHK-227E-J3T0	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
45	QYE5-6CQ6-STMS-DQ43	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
46	RVFY-9CG3-KG2V-66VI	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
47	RHYJ-NVSI-7860-R34Q	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
48	KSJ7-JHRL-NC4W-KF4Y	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
49	ZC0F-ZQ6Y-14IV-AEIB	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
50	DD7V-RO93-OQHM-QYSC	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
51	FEVO-RTDN-VOYB-27NO	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
52	UUBK-HY1J-YWR0-DQ1K	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
53	R3KV-PQJF-SI2A-35AR	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
54	NJZG-SQD2-YXBM-3TKU	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
55	J2RT-F7MP-LG63-T724	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
56	ASZP-MGE3-DWKP-KBAQ	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
57	2847-IF62-UCI9-PCZ1	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
58	ET7G-NMJ5-P4QI-42RB	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
59	FRHI-9SEX-P3ON-G78F	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
60	MF5W-H98B-4VVY-ZHNV	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
61	JVSO-W9BV-OY2X-O9TH	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
62	4ONT-OX2S-I028-KSO4	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
63	CEGL-6XGV-MYQR-B394	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
64	DL7N-V3S3-HSLU-XRLT	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
65	AQKQ-TVEN-AI1W-TBWB	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
66	PRYM-08O6-YVOM-60XX	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
67	KC4I-65R3-L37I-GN57	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
68	2XDA-OEY1-WX93-XKX3	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
69	N7DC-VKZQ-F1VK-Q3MB	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
70	12PU-S5LU-TKT6-914Y	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
71	TUE7-3UVM-ZAVG-2AMU	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
72	R2FJ-B4PO-Y00C-6UNV	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
73	D6MY-PCIX-OST0-1TJV	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
74	ELNU-O23W-5YOJ-X2SE	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
75	K3P6-B2BD-8878-8220	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
76	I3FV-CHG5-RTMZ-X875	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
77	X8V4-ACIF-NQPL-RQFQ	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
78	XE9O-0A0R-R5SF-EAIV	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
79	SL3R-MP0B-HNI0-0PXO	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
80	9EWX-TAHJ-NSOX-V1B6	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
81	MIFM-KRIY-BLM4-AUTS	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
82	5TN1-AGM5-ZR0O-KYIX	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
83	Z6Q4-0LOR-0Y1H-4KH7	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
84	OMOR-6SN0-H20U-XAF7	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
85	V9JC-4N9D-QHJC-5QQF	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
86	Z6NS-A2DH-RP8H-5XIJ	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
87	DVYY-18E0-C9VR-7CVR	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
88	O36V-DUGI-JCUD-JCO8	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
89	SZGC-5YSW-SNUK-KCKY	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
90	INVF-0U6A-IT42-RSRI	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
91	2VCO-31X3-4A7D-DVXO	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
92	KZFD-QEZ6-1X4C-DLG7	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
93	P1Z2-PQQG-VCF1-5APN	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
94	2HBZ-QEF0-MDJ3-S4OL	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
95	R858-67TO-TRPR-K7L1	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
96	ANCZ-KAB6-B0D5-VG2L	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
97	PNL1-HZX6-3KOO-OADY	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
98	S8S2-E77U-C572-H32J	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
99	22RL-A7C0-IJBC-YWAL	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
100	7CP5-74UD-6D1H-Q30S	\N	\N	f	1	0	\N	2025-07-31 20:32:40.776634	\N	\N	\N	\N	f	\N	admin
101	YZ66-DO5N-M0O8-TAYB	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
102	KZRQ-38QM-OGFU-QFMY	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
103	COYP-UMHF-GDCA-SO5B	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
104	3NNK-PNQS-RJ05-57G4	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
105	ZR6T-KO3W-YQU9-V56R	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
106	3ZC5-I35A-NSRI-X5D0	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
107	LEGN-EVWV-M2UW-EEQ9	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
108	FDBH-HDU9-53YA-AOB8	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
109	JMPG-1ANK-03KI-EYME	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
110	9KBQ-EMMU-BDT7-0G4X	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
111	6X8A-NSEW-SNB6-4AGG	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
112	6BMW-SKIE-GXUT-CI10	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
113	V7KA-TD0H-592X-QUZ2	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
114	YZ60-PDE8-33LE-GWCN	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
115	BZSI-KKBE-CEHC-U74E	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
116	L6GR-5F0P-3J30-2KXT	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
117	YND3-170O-KOEJ-M1H9	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
118	M0PN-QEGV-JO1B-8UBW	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
119	YA5Z-0VT2-ZYT0-H30H	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
120	R38D-Z785-ICCC-83B0	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
121	WAI7-WUKV-PXLO-AAHY	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
122	XWPK-DREW-0ZP8-KXWT	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
123	OVRS-5Y88-QKG8-0HQ8	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
124	BCCX-H5VR-8ZM7-V415	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
125	9TA9-3ATA-U0QR-YEPG	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
126	RZ37-PP5Z-LXPQ-LKIR	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
127	GOT4-WHIR-AJRP-67JG	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
128	359D-1MYU-DJA3-B21K	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
129	8UXD-RML5-139R-TUDY	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
130	M1EM-CPMR-LFXE-H4DK	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
131	UVNJ-QIFW-RQ3N-5UVN	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
132	ZBM8-NMK7-IT2M-GZM5	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
133	M8YH-73IO-TSV4-VMJQ	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
134	HTZ3-79RO-N2FH-DHC5	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
135	29F4-QIJD-2Q2U-HUHF	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
136	A0IR-8YSZ-0T5J-MHMV	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
137	X394-W76S-XA7R-TBYZ	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
138	7AIU-HS52-OQNO-X69O	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
139	RWCS-8U7A-5FQQ-JYR6	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
140	A39U-31HW-90C6-QJDM	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
141	WGO7-ZA1H-RAUY-EEGB	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
142	YK3T-J8E3-WFLD-43DD	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
143	37ZO-5CWT-OTHK-0HAU	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
144	P77S-3SJE-UZWV-FEZA	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
145	PWDL-7G97-E6F1-R1PG	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
146	AN0K-RB62-2RCF-RO7F	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
147	Z2NP-NZL2-O2KD-IXSC	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
148	4OMB-ZG03-K7R7-B6QQ	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
149	J7JD-WB0D-BRHG-AO6W	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
150	WH63-Z8F6-CHNH-REBH	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
151	ARRA-LK2V-MR3N-B7VK	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
152	VVTY-Q26U-LEW0-IA1D	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
153	N44F-R15A-O7FX-E426	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
154	WR5V-NJG6-0EVT-CH85	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
155	OIM3-6RK7-CVF1-1E5O	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
156	5Q3N-58T4-VKAV-8642	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
157	LBKU-A5FX-FPUP-5MET	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
158	ON3M-9RCB-C3QT-28E5	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
159	96EM-M6Z7-EGSG-CH5P	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
160	8GIG-6O7P-A814-TJ2B	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
161	JYFT-41ZL-EEUB-C1H2	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
162	FMHN-XFY9-WTRG-C6BR	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
163	Q4FD-DREY-O17S-RSO8	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
164	ENO2-J2OO-KKTK-HHCO	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
165	D7LV-UW9Z-OLAH-VE45	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
166	M29T-ITRQ-FHEB-DRV4	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
167	FSAK-9OOE-KRPF-BLJ4	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
168	NRW1-YV4T-G1HQ-NEY7	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
169	5NZS-D6AN-FSHI-XNO3	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
170	BCNZ-ZBMW-8SSB-OYMS	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
171	IVYT-MVTP-L280-TQPJ	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
172	9OME-1YKH-FJ5Z-PY77	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
173	W5UK-KJ77-F9VT-KRIR	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
174	4YF2-4VGG-ZUPG-MGRX	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
175	HD5I-0H91-AKLR-TWOI	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
176	1AYI-LXKQ-PPYU-YPCU	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
177	7UA0-TK6L-8BWP-M1KE	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
178	EDO6-MML3-VGGI-6S23	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
179	JBN9-T62K-SO38-3BVP	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
180	IP68-UFDF-AYEN-EPE9	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
181	EYG0-I1YH-4MWW-NYOO	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
182	8JV0-4RXG-BJ12-KPKT	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
183	KSS4-X5MY-R33G-G1ZG	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
184	6VTV-95QQ-9KC0-46R8	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
185	BI1Z-KO0G-0H7G-CGS4	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
186	S2U0-03V4-JNVT-4P06	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
187	CIFB-8HH4-VAVX-6OIE	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
188	EBBO-9EUY-EFDJ-PZAT	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
189	G5N2-14XQ-KBCC-WIZL	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
190	J6WV-L2PI-DVUJ-VM4I	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
191	FFLU-47I5-0ST8-1BXJ	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
192	FJGY-CJPS-LJ47-55NC	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
193	SR73-CD0I-U394-CKA7	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
194	TARB-C0S4-UT6K-NR29	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
195	6L90-XZIU-Y773-WYU3	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
196	CCMD-8HT1-FS70-4I6L	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
197	U1U1-EM6E-XBBM-LJZO	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
198	BCP9-8CVT-JMG7-504O	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
199	DY0A-T371-61JM-0DLK	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
200	WDKJ-RZJ4-Z5W5-D4BH	\N	\N	f	1	0	\N	2025-07-31 20:32:53.613925	\N	\N	\N	\N	f	\N	admin
201	EF1A-WL8V-076D-BIT7	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
202	TA45-FAE5-I8ML-V5DH	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
203	G1ZJ-BFL0-FBGJ-UL7I	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
204	E1HC-YKJN-PS5B-CKNW	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
205	LKRQ-5KWI-H4DD-GE82	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
206	U5XR-DO1M-E3L9-J5O2	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
207	B8R3-L6IM-9BOD-3QSD	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
208	MOCL-EAIY-2VQX-1PYA	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
209	UMY0-1KNA-FDT6-KZKQ	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
210	RVQJ-V84N-F0O9-8W0P	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
211	0CYZ-LRV4-POZ3-TJOU	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
212	A3YL-L2XK-9ME2-GUJF	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
213	AEUF-K696-L3TS-MMXF	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
214	1258-NW2K-YQAP-F8XZ	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
215	U0T6-4MVL-SVDE-AW89	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
216	C6PH-3Z19-0I2E-TKVW	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
217	KS1F-65I0-WRO6-4A3X	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
218	5LQC-YNY6-JCPO-O2M5	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
219	IKBU-SDIU-W728-15GZ	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
220	IAZJ-GSEN-6JGN-50FX	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
221	MS31-LI9J-YZXJ-F17R	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
222	25XR-D4US-07FL-K1AR	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
223	IBAC-755Q-6ZAV-HROT	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
224	KSVB-ECOG-RQ0L-35DK	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
225	0248-NULI-IQM4-WL5J	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
226	R0MJ-U6FQ-UX04-5LAZ	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
227	FVD2-UV8L-34WF-DTKZ	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
228	HLRK-1UQM-51NH-QYWZ	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
229	KREN-JW90-2A1A-Q9VA	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
230	LCMZ-3QVQ-E1EI-OGQS	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
231	OVAN-QPRA-R2WN-905J	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
232	0LLJ-5JJF-LCT9-RGU5	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
233	CLRO-C97Y-C3LI-5G42	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
234	MRN2-DRZV-67HV-5268	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
235	A81L-9MJV-BEO9-PCIQ	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
236	GUDK-RQ74-K1CJ-I0AN	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
237	8TS9-YE0W-Z8EF-CDMD	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
238	9GK3-X4ZM-UQEY-ZZXX	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
239	SM9F-9NEG-S395-MNCD	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
240	YW8V-KA9K-9OH6-N45F	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
241	STSM-NAYV-7ZD9-PK34	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
242	K31V-YCS0-B2O2-53CI	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
243	USID-YULE-0QXS-5OK4	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
244	C5B6-DX0M-QAC5-CY6V	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
245	YK5F-4E76-31H3-397A	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
246	IAPG-U3UB-7DSE-4ZG4	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
247	AZND-JK0L-Z8ZB-OXN4	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
248	I2ED-8TQV-6S9E-MK1I	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
249	HACG-U18M-SBXX-TREI	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
250	5BOS-V83J-O7U8-5ZHN	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
251	ZJC2-K470-MLLM-QEKC	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
252	6B49-YRIO-IOF2-W7RU	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
253	CRRR-GKCF-97TU-9MGY	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
254	WQMY-W21F-6X7L-36EU	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
255	8OK9-B6PU-QPYT-WAAH	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
256	MXWA-H15U-CTT6-UGH8	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
257	V1U7-088M-OHAR-7WI6	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
258	E8D9-QXF9-NZW8-LDUY	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
259	591L-5HL5-HONJ-ZJJB	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
260	QDOH-A26F-D664-5IFN	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
261	I6AF-OYB2-GZHF-67EN	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
262	DL1U-XOD9-0YQQ-HMCQ	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
263	8P9I-KV10-K15D-WLA0	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
264	5D2P-JHWP-4TDV-6ZWF	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
265	0WSF-BV4W-HLWW-U3OT	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
266	16VD-PG5G-ONGA-O064	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
267	LACE-PTVQ-CNB0-084T	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
268	U80E-XVNW-682B-AIGC	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
269	AA1N-9K95-67H3-2N8Q	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
270	OLHD-9483-PFD5-A8Q9	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
271	SMP8-91GX-IJNB-LGXW	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
272	H3QJ-UXMT-YYJG-LJFQ	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
273	AQ67-OGI0-XY67-JXIC	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
274	NZX2-3YN8-NTMH-4OOC	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
275	G4BE-E6U0-VBW8-51AA	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
276	FTBZ-KD7Y-ASNU-JQ4S	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
277	S2HR-BG9Q-MJL4-J0XB	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
278	8O7B-H79D-RZ7B-2C08	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
279	JWAU-0FYT-DTIL-OZZX	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
280	Z4TD-AK6K-NNB6-SA51	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
281	0X5H-4NLI-W7TL-9EBT	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
282	EVPW-6K3X-8AP8-4Z1K	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
283	VZFH-SDK7-7RL3-ZLTC	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
284	1D82-OCJ7-MZE8-P15J	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
285	WQ6Y-4ZNQ-GBV1-K49O	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
286	09QU-0N1X-2W4I-1Q42	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
287	EUT4-2I0I-JHHD-841S	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
288	Q5QE-BQSY-UXPQ-13K7	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
289	GFMX-42EI-QVZ4-E15F	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
290	YGNW-6PO5-2883-IY22	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
291	662K-FVQ9-VRG7-JQ08	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
292	BEKZ-6M1V-ZDV8-KH5C	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
293	FWMY-WUS9-KIIS-XQ9I	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
294	EBO8-3QCB-E4U9-PWD5	\N	\N	f	1	0	\N	2025-07-31 20:33:04.753153	\N	\N	\N	\N	f	\N	admin
300	DJEM-Z4F8-U2TR-BHCX	\N	1943623053071765504	t	1	1	\N	2025-07-31 20:33:04.753153	2025-08-04 14:01:49.432	\N	\N	\N	f	\N	admin
299	6HO4-IPCY-LHK4-OOJR	\N	1940567468453367808	t	1	1	\N	2025-07-31 20:33:04.753153	2025-08-04 14:11:55.84	\N	\N	\N	f	\N	admin
298	8CBG-TXRW-Q4LK-Z6BR	\N	unclaimed_1754334930623_nayncpsyk	t	1	1	\N	2025-07-31 20:33:04.753153	2025-08-04 20:13:36.427	\N	\N	\N	f	\N	admin
297	UFSV-1XWE-23WE-ON2H	\N	unclaimed_1754350236092_z31grdc8w	t	1	1	\N	2025-07-31 20:33:04.753153	2025-08-04 23:36:22.476	\N	\N	\N	f	\N	admin
296	IYMK-05G1-E7EP-DQ4P	\N	1953113551893073922	t	1	1	\N	2025-07-31 20:33:04.753153	2025-08-10 22:35:05.805	\N	\N	\N	f	\N	admin
295	PRPF-8PFO-269Y-ILPQ	\N	1955002803245682690	t	1	1	\N	2025-07-31 20:33:04.753153	2025-08-11 20:40:43.547	\N	\N	\N	f	\N	admin
352	SSWX-FX36-NOXT-SH9D	\N	\N	f	1	0	\N	2025-08-13 22:21:57.758188	\N	\N	\N	\N	f	\N	admin
353	UPDA-7BIA-7TJP-SRZT	\N	\N	f	1	0	\N	2025-08-13 22:21:57.758188	\N	\N	\N	\N	f	\N	admin
354	6FB5-JRB4-BS6U-OCPO	\N	\N	f	1	0	\N	2025-08-13 22:21:57.758188	\N	\N	\N	\N	f	\N	admin
355	HDRO-QDHQ-RAN8-EES3	\N	\N	f	1	0	\N	2025-08-13 22:21:57.758188	\N	\N	\N	\N	f	\N	admin
356	AINB-9QMY-6NP1-QDOF	\N	\N	f	1	0	\N	2025-08-13 22:21:57.758188	\N	\N	\N	\N	f	\N	admin
357	QV26-2V8A-EHTF-CIF5	\N	\N	f	1	0	\N	2025-08-13 22:21:57.758188	\N	\N	\N	\N	f	\N	admin
358	R3HS-WBQA-W99M-5CF2	\N	\N	f	1	0	\N	2025-08-13 22:21:57.758188	\N	\N	\N	\N	f	\N	admin
360	BVFW-5PSE-DY5K-FDUL	\N	\N	f	1	0	\N	2025-08-13 22:21:57.758188	\N	\N	\N	\N	f	\N	admin
361	HC6E-OGWV-MU8E-30RH	\N	\N	f	1	0	\N	2025-08-13 22:21:57.758188	\N	\N	\N	\N	f	\N	admin
318	49OVT32V	unclaimed_1753893705381_eeppyn035	\N	f	1	0	\N	2025-08-12 20:59:30.000571	\N	\N	\N	\N	f	\N	user
319	MB5PFJ4K	unclaimed_1753718596277_lxvbe0r2g	\N	f	1	0	\N	2025-08-12 20:59:30.134916	\N	\N	\N	\N	f	\N	user
320	UNA88IKA	unclaimed_1753718596277_lxvbe0r2g	\N	f	1	0	\N	2025-08-12 20:59:30.20204	\N	\N	\N	\N	f	\N	user
321	S8INYET8	unclaimed_1753718596277_lxvbe0r2g	\N	f	1	0	\N	2025-08-12 20:59:30.268968	\N	\N	\N	\N	f	\N	user
322	6I91EW4F	unclaimed_1754048806293_3eppwfq0a	\N	f	1	0	\N	2025-08-12 20:59:30.404208	\N	\N	\N	\N	f	\N	user
323	CT2X9RW0	unclaimed_1754048806293_3eppwfq0a	\N	f	1	0	\N	2025-08-12 20:59:30.472516	\N	\N	\N	\N	f	\N	user
324	UOLCBBCC	unclaimed_1754048806293_3eppwfq0a	\N	f	1	0	\N	2025-08-12 20:59:30.540388	\N	\N	\N	\N	f	\N	user
325	XWUGI36M	unclaimed_1754931413976_tdkck1zod	\N	f	1	0	\N	2025-08-12 20:59:30.676652	\N	\N	\N	\N	f	\N	user
326	D8O4MNIX	unclaimed_1754931413976_tdkck1zod	\N	f	1	0	\N	2025-08-12 20:59:30.744818	\N	\N	\N	\N	f	\N	user
327	SK26WEMJ	unclaimed_1754931413976_tdkck1zod	\N	f	1	0	\N	2025-08-12 20:59:30.812693	\N	\N	\N	\N	f	\N	user
328	F3AN46HQ	unclaimed_1754325122482_cqyin11i0	\N	f	1	0	\N	2025-08-12 20:59:30.947229	\N	\N	\N	\N	f	\N	user
329	67ZDKKII	unclaimed_1754325122482_cqyin11i0	\N	f	1	0	\N	2025-08-12 20:59:31.014064	\N	\N	\N	\N	f	\N	user
330	LRRVPSPK	unclaimed_1754325122482_cqyin11i0	\N	f	1	0	\N	2025-08-12 20:59:31.082365	\N	\N	\N	\N	f	\N	user
331	4UEDZIA1	unclaimed_1754350236092_z31grdc8w	\N	f	1	0	\N	2025-08-12 20:59:31.221456	\N	\N	\N	\N	f	\N	user
332	Q1BHUICW	unclaimed_1754350236092_z31grdc8w	\N	f	1	0	\N	2025-08-12 20:59:31.289026	\N	\N	\N	\N	f	\N	user
333	6EEV1HH1	unclaimed_1754350236092_z31grdc8w	\N	f	1	0	\N	2025-08-12 20:59:31.356876	\N	\N	\N	\N	f	\N	user
334	QCIFFOEL	unclaimed_1754443622811_h0dewav4n	\N	f	1	0	\N	2025-08-12 20:59:31.492229	\N	\N	\N	\N	f	\N	user
335	OKR8R1BA	unclaimed_1754443622811_h0dewav4n	\N	f	1	0	\N	2025-08-12 20:59:31.560891	\N	\N	\N	\N	f	\N	user
336	YG18NYKP	unclaimed_1754443622811_h0dewav4n	\N	f	1	0	\N	2025-08-12 20:59:31.629345	\N	\N	\N	\N	f	\N	user
337	5VDME5X8	unclaimed_1754334930623_nayncpsyk	\N	f	1	0	\N	2025-08-12 20:59:31.764985	\N	\N	\N	\N	f	\N	user
338	B7EFD15D	unclaimed_1754334930623_nayncpsyk	\N	f	1	0	\N	2025-08-12 20:59:31.83296	\N	\N	\N	\N	f	\N	user
339	IN4LX5K8	unclaimed_1754334930623_nayncpsyk	\N	f	1	0	\N	2025-08-12 20:59:31.901661	\N	\N	\N	\N	f	\N	user
340	KNE08MW1	unclaimed_1753906423772_4aedo5x3t	\N	f	1	0	\N	2025-08-12 20:59:32.037643	\N	\N	\N	\N	f	\N	user
341	Y9DFN66A	unclaimed_1753906423772_4aedo5x3t	\N	f	1	0	\N	2025-08-12 20:59:32.105678	\N	\N	\N	\N	f	\N	user
342	9NI9J52C	unclaimed_1753906423772_4aedo5x3t	\N	f	1	0	\N	2025-08-12 20:59:32.182327	\N	\N	\N	\N	f	\N	user
343	TT52TH6B	1955002803245682690	\N	f	1	0	\N	2025-08-12 20:59:32.323121	\N	\N	\N	\N	f	\N	user
344	XRYX9JQ9	1955002803245682690	\N	f	1	0	\N	2025-08-12 20:59:32.391174	\N	\N	\N	\N	f	\N	user
345	PX2XXVNR	1955002803245682690	\N	f	1	0	\N	2025-08-12 20:59:32.459284	\N	\N	\N	\N	f	\N	user
346	EZ1XRGU2	1940567468453367808	\N	f	1	0	\N	2025-08-12 20:59:32.594501	\N	\N	\N	\N	f	\N	user
347	3R3JMTJ9	1940567468453367808	\N	f	1	0	\N	2025-08-12 20:59:32.665601	\N	\N	\N	\N	f	\N	user
349	KRIDH5PA	1943623053071765504	\N	f	1	0	\N	2025-08-12 20:59:32.868827	\N	\N	\N	\N	f	\N	user
350	R5OJ8EAW	1943623053071765504	\N	f	1	0	\N	2025-08-12 20:59:32.936994	\N	\N	\N	\N	f	\N	user
351	NLJJ6JP1	1943623053071765504	\N	f	1	0	\N	2025-08-12 20:59:33.004906	\N	\N	\N	\N	f	\N	user
348	QHCTT7VN	1940567468453367808	1955633228036886528	t	1	1	\N	2025-08-12 20:59:32.733771	2025-08-13 21:37:53.36	10.82.6.23	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15	Unknown	f	\N	user
359	N6J1-M5WC-U85J-D7OO	\N	unclaimed_1753906423772_4aedo5x3t	t	1	1	\N	2025-08-13 22:21:57.758188	2025-09-03 08:29:38.923	10.82.12.190	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15	Unknown	f	\N	admin
\.


--
-- Data for Name: invite_rewards; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.invite_rewards (id, user_id, invite_usage_id, reward_type, xp_amount, milestone, new_codes_generated, created_at) FROM stdin;
\.


--
-- Data for Name: invite_submissions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.invite_submissions (id, user_id, invite_code, status, submitted_at, approved_at, notes) FROM stdin;
\.


--
-- Data for Name: invite_usage; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.invite_usage (id, invite_code_id, inviter_id, invited_user_id, ip_address, user_agent, location, device_fingerprint, xp_reward_given, created_at) FROM stdin;
\.


--
-- Data for Name: market_positions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.market_positions (id, market_id, user_id, outcome, shares_held, average_price, total_invested, unrealized_pnl, realized_pnl, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: market_settlements; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.market_settlements (id, market_id, stance_id, final_champion_votes, final_challenge_votes, final_oppose_votes, total_votes, winning_outcome, total_payout, winning_positions, losing_positions, settled_at) FROM stdin;
\.


--
-- Data for Name: market_trades; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.market_trades (id, market_id, user_id, outcome, trade_type, shares_traded, price_per_share, total_cost, market_price_a, market_price_b, created_at) FROM stdin;
\.


--
-- Data for Name: notification_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notification_settings (id, user_id, email_enabled, push_enabled, in_app_enabled, comment_notifications, vote_notifications, review_notifications, follow_notifications, achievement_notifications, system_notifications, xp_notifications, grs_notifications, weekly_digest, sound_enabled, created_at, updated_at) FROM stdin;
1	1940567468453367808	t	t	t	t	t	t	t	t	t	t	t	t	f	2025-07-31 11:08:36.18652	2025-07-31 11:08:36.18652
2	unclaimed_1753906423772_4aedo5x3t	t	t	t	t	t	t	t	t	t	t	t	t	f	2025-09-04 20:13:20.028917	2025-09-04 20:13:20.028917
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notifications (id, user_id, type, title, message, read, action_url, sender_id, sender_username, sender_avatar, related_entity_type, related_entity_id, metadata, created_at) FROM stdin;
1	1940567468453367808	test	Test Notification	Testing if notification creation works	t	\N	\N	\N	\N	\N	\N	\N	2025-09-04 20:53:33.273592
3	1940567468453367808	comment	New comment on your post	amandagieschen commented on "jnfgrjkgnfrg"	t	/governance/25	unclaimed_1753906423772_4aedo5x3t	\N	\N	\N	\N	{"issueId": 25, "issueTitle": "jnfgrjkgnfrg"}	2025-09-05 00:03:48.29681
10	unclaimed_1753906423772_4aedo5x3t	stance_result	Stance succeeded	Your champion stance was supported by the community!	f	/governance/16	\N	\N	\N	\N	\N	{"outcome": "succeeded", "stanceId": 16, "stanceType": "champion", "winningVoteType": "champion", "majoritySupportsStance": true}	2025-09-05 09:03:57.782244
11	unclaimed_1754334930623_nayncpsyk	stance_result	Stance about you completed	You were championed by amandagieschen and the community agreed!	f	/governance/16	\N	\N	\N	\N	\N	{"outcome": "succeeded", "stanceId": 16, "stanceType": "champion", "wasTargeted": true}	2025-09-05 09:03:57.984726
12	unclaimed_1753906423772_4aedo5x3t	comment	New comment on your stance	Masterlife_24: "hello how are you and when is this going to work a..."	f	/governance/27	1940567468453367808	\N	\N	\N	\N	{"issueId": 27, "issueTitle": "Rjgbjg hyegfy4fgb", "contentType": "stance", "commentContent": "hello how are you and when is this going to work and how will it work!! "}	2025-09-06 10:24:25.034929
13	unclaimed_1753906423772_4aedo5x3t	comment	New comment on your stance	Masterlife_24: "Try me again"	f	/governance/27	1940567468453367808	\N	\N	\N	\N	{"issueId": 27, "issueTitle": "Rjgbjg hyegfy4fgb", "contentType": "stance", "commentContent": "Try me again"}	2025-09-06 10:26:13.063601
14	unclaimed_1753906423772_4aedo5x3t	stance	Someone championed you	Masterlife_24 championed you with a stance: "fjknrfjkrnfj"	f	/governance/29	1940567468453367808	\N	\N	\N	\N	{"stanceId": 29, "stanceType": "champion", "stanceTitle": "fjknrfjkrnfj"}	2025-09-06 11:41:21.954589
4	1940567468453367808	comment	New comment on your post	amandagieschen commented on "jnfgrjkgnfrg"	t	/governance/25	unclaimed_1753906423772_4aedo5x3t	\N	\N	\N	\N	{"issueId": 25, "issueTitle": "jnfgrjkgnfrg"}	2025-09-05 00:10:00.872813
5	1940567468453367808	comment	New comment on your post	amandagieschen commented on "jnfgrjkgnfrg"	t	/governance/25	unclaimed_1753906423772_4aedo5x3t	\N	\N	\N	\N	{"issueId": 25, "issueTitle": "jnfgrjkgnfrg"}	2025-09-05 00:10:29.425184
6	1940567468453367808	comment	New comment on your post	amandagieschen commented on "behfdbfhdv"	t	/governance/22	unclaimed_1753906423772_4aedo5x3t	\N	\N	\N	\N	{"issueId": 22, "issueTitle": "behfdbfhdv"}	2025-09-05 00:11:19.827826
7	1940567468453367808	comment	New comment on your stance	amandagieschen commented on "jnfgrjkgnfrg"	t	/governance/25	unclaimed_1753906423772_4aedo5x3t	\N	\N	\N	\N	{"issueId": 25, "issueTitle": "jnfgrjkgnfrg", "contentType": "stance"}	2025-09-05 00:26:08.525131
8	1940567468453367808	comment	New comment on your stance	amandagieschen commented on "jnfgrjkgnfrg"	t	/governance/25	unclaimed_1753906423772_4aedo5x3t	\N	\N	\N	\N	{"issueId": 25, "issueTitle": "jnfgrjkgnfrg", "contentType": "stance"}	2025-09-05 00:27:04.176656
9	1940567468453367808	comment	New comment on your stance	amandagieschen: "How come I cannot see any of the expired stances t..."	t	/governance/25	unclaimed_1753906423772_4aedo5x3t	\N	\N	\N	\N	{"issueId": 25, "issueTitle": "How come I cannot see any of the expired stances t...", "contentType": "stance", "commentContent": "How come I cannot see any of the expired stances they should be able to be seen\\n\\nTips for effective stances\\n\\n• Be specific and provide concrete examples\\n\\n• Link to original proposals when possible\\n\\n• Explain the potential impact of your stance\\n\\n• Stay professional and constructiv"}	2025-09-05 01:09:50.773509
17	unclaimed_1754334930623_nayncpsyk	stance	Someone championed you	Masterlife_24 championed you with a stance: "djjdfnejf kjnjnj"	f	/governance/30	1940567468453367808	\N	\N	\N	\N	{"stanceId": 30, "stanceType": "champion", "stanceTitle": "djjdfnejf kjnjnj"}	2025-09-06 22:49:44.588775
18	unclaimed_1754048806293_3eppwfq0a	stance	Someone championed you	amandagieschen championed you with a stance: "Djknjkvnrfjrv dvdjv"	f	/governance/31	unclaimed_1753906423772_4aedo5x3t	\N	\N	\N	\N	{"stanceId": 31, "stanceType": "champion", "stanceTitle": "Djknjkvnrfjrv dvdjv"}	2025-09-06 22:55:15.570308
19	unclaimed_1753906423772_4aedo5x3t	vote	Someone voted on your stance	Masterlife_24 voted "champion" on your stance about "Djknjkvnrfjrv dvdjv"	f	/governance/31	1940567468453367808	\N	\N	\N	\N	{"itemId": 31, "voteType": "champion", "itemTitle": "Djknjkvnrfjrv dvdjv", "targetType": "stance"}	2025-09-06 22:57:55.483201
33	1955633228036886528	stance	Someone championed you	Masterlife_24 championed you with a stance: "nkjnjkebfjehdbfe"	f	/issue/33	1940567468453367808	\N	\N	\N	\N	{"stanceId": 33, "stanceType": "champion", "stanceTitle": "nkjnjkebfjehdbfe"}	2025-09-08 20:06:01.038605
21	1940567468453367808	comment	New comment on your stance	amandagieschen: "Hello there"	t	/governance/30	unclaimed_1753906423772_4aedo5x3t	\N	\N	\N	\N	{"issueId": 30, "issueTitle": "djjdfnejf kjnjnj", "contentType": "stance", "commentContent": "Hello there"}	2025-09-07 19:09:12.488879
22	1940567468453367808	comment	New comment on your stance	amandagieschen: "V fgvfgvfgvgfvfg"	t	/#/governance/30	unclaimed_1753906423772_4aedo5x3t	\N	\N	\N	\N	{"issueId": 30, "issueTitle": "djjdfnejf kjnjnj", "contentType": "stance", "commentContent": "V fgvfgvfgvgfvfg"}	2025-09-07 19:24:02.659134
23	1940567468453367808	comment	New comment on your stance	amandagieschen: "Gtygftyrtcrtcrt"	t	/issue/30	unclaimed_1753906423772_4aedo5x3t	\N	\N	\N	\N	{"issueId": 30, "issueTitle": "djjdfnejf kjnjnj", "contentType": "stance", "commentContent": "Gtygftyrtcrtcrt"}	2025-09-07 20:01:00.13713
34	unclaimed_1754350236092_z31grdc8w	stance	Someone championed you	Masterlife_24 championed you with a stance: "jjjnejnkmknknknk"	f	/issue/34	1940567468453367808	\N	\N	\N	\N	{"stanceId": 34, "stanceType": "champion", "stanceTitle": "jjjnejnkmknknknk"}	2025-09-08 20:13:47.479872
24	1940567468453367808	stance	Someone championed you	amandagieschen championed you with a stance: " B by BK John hjb"	t	/issue/32	unclaimed_1753906423772_4aedo5x3t	\N	\N	\N	\N	{"stanceId": 32, "stanceType": "champion", "stanceTitle": " B by BK John hjb"}	2025-09-07 20:02:27.054665
25	unclaimed_1753906423772_4aedo5x3t	vote	Someone voted on your comment	Masterlife_24 voted "upvote" on your comment about "Gtygftyrtcrtcrt..."	f	/review/43	1940567468453367808	\N	\N	\N	\N	{"itemId": 43, "voteType": "upvote", "itemTitle": "Gtygftyrtcrtcrt...", "targetType": "comment"}	2025-09-07 21:21:25.025082
26	unclaimed_1753906423772_4aedo5x3t	comment_reply	Someone replied to your comment	Masterlife_24 replied to your comment on "djjdfnejf kjnjnj": "I don't agree with this view point..."	f	/issue/30	1940567468453367808	\N	\N	\N	\N	{"stanceId": 30, "stanceTitle": "djjdfnejf kjnjnj", "replyContent": "I don't agree with this view point"}	2025-09-07 21:22:18.811163
27	unclaimed_1753906423772_4aedo5x3t	comment_reply	Someone replied to your comment	Masterlife_24 replied to your comment on "djjdfnejf kjnjnj": "hello there..."	f	/issue/30	1940567468453367808	\N	\N	\N	\N	{"stanceId": 30, "stanceTitle": "djjdfnejf kjnjnj", "replyContent": "hello there"}	2025-09-07 21:36:13.005589
28	unclaimed_1753906423772_4aedo5x3t	comment_reply	Someone replied to your comment	Masterlife_24 replied to your comment on "djjdfnejf kjnjnj": "How are you..."	f	/issue/30	1940567468453367808	\N	\N	\N	\N	{"stanceId": 30, "stanceTitle": "djjdfnejf kjnjnj", "replyContent": "How are you"}	2025-09-07 22:15:51.318057
29	1940567468453367808	stance_result	Stance succeeded	Your champion stance was supported by the community!	f	/governance/28	\N	\N	\N	\N	\N	{"outcome": "succeeded", "stanceId": 28, "stanceType": "champion", "winningVoteType": "champion", "majoritySupportsStance": true}	2025-09-08 11:31:43.557378
30	unclaimed_1753906423772_4aedo5x3t	stance_result	Stance about you completed	You were championed by Masterlife_24 and the community agreed!	f	/governance/28	\N	\N	\N	\N	\N	{"outcome": "succeeded", "stanceId": 28, "stanceType": "champion", "wasTargeted": true}	2025-09-08 11:31:43.75734
31	1940567468453367808	stance_result	Stance succeeded	Your champion stance was supported by the community!	f	/governance/29	\N	\N	\N	\N	\N	{"outcome": "succeeded", "stanceId": 29, "stanceType": "champion", "winningVoteType": "champion", "majoritySupportsStance": true}	2025-09-08 11:41:43.208744
32	unclaimed_1753906423772_4aedo5x3t	stance_result	Stance about you completed	You were championed by Masterlife_24 and the community agreed!	f	/governance/29	\N	\N	\N	\N	\N	{"outcome": "succeeded", "stanceId": 29, "stanceType": "champion", "wasTargeted": true}	2025-09-08 11:41:43.41538
36	unclaimed_1754334930623_nayncpsyk	stance_result	Stance about you completed	You were championed by Masterlife_24 and the community agreed!	f	/governance/30	\N	\N	\N	\N	\N	{"outcome": "succeeded", "stanceId": 30, "stanceType": "champion", "wasTargeted": true}	2025-09-08 22:50:36.783914
37	unclaimed_1753906423772_4aedo5x3t	stance_result	Stance succeeded	Your champion stance was supported by the community!	f	/governance/31	\N	\N	\N	\N	\N	{"outcome": "succeeded", "stanceId": 31, "stanceType": "champion", "winningVoteType": "champion", "majoritySupportsStance": true}	2025-09-08 22:55:39.119679
38	unclaimed_1754048806293_3eppwfq0a	stance_result	Stance about you completed	You were championed by amandagieschen and the community agreed!	f	/governance/31	\N	\N	\N	\N	\N	{"outcome": "succeeded", "stanceId": 31, "stanceType": "champion", "wasTargeted": true}	2025-09-08 22:55:39.32074
39	unclaimed_1753701743381_69oe5eznf	stance	Someone championed you	Masterlife_24 championed you with a stance: "ehbfdhjebfhj"	f	/issue/35	1940567468453367808	\N	\N	\N	\N	{"stanceId": 35, "stanceType": "champion", "stanceTitle": "ehbfdhjebfhj"}	2025-09-17 11:40:47.233868
35	1940567468453367808	stance_result	Stance succeeded	Your champion stance was supported by the community!	t	/governance/30	\N	\N	\N	\N	\N	{"outcome": "succeeded", "stanceId": 30, "stanceType": "champion", "winningVoteType": "champion", "majoritySupportsStance": true}	2025-09-08 22:50:36.583735
40	unclaimed_1761057399602_oj87lsf6d	review	New review received	Masterlife_24 gave you a 4-star review: "Tips for effective reviews\n• Be honest and constru..."	f	/my-reviews	1940567468453367808	\N	\N	\N	\N	{"rating": 4, "reviewText": "Tips for effective reviews\\n• Be honest and constructive in your feedback\\n• Focus on specific contributions and behaviors\\n• Explain the impact of their work on the community\\n• Stay professional and respectful"}	2025-10-21 14:36:47.968241
41	unclaimed_1761077625620_h9olo856d	review	New review received	Masterlife_24 gave you a 4-star review: "Tips for effective reviews\n• Be honest and constru..."	f	/my-reviews	1940567468453367808	\N	\N	\N	\N	{"rating": 4, "reviewText": "Tips for effective reviews\\n• Be honest and constructive in your feedback\\n• Focus on specific contributions and behaviors\\n• Explain the impact of their work on the community\\n• Stay professional and respectfu"}	2025-10-21 20:14:12.325461
42	unclaimed_1761590984358_cylskgzq6	review	New review received	Masterlife_24 gave you a 4-star review: "Tips for effective reviews\n• Be honest and constru..."	f	/my-reviews	1940567468453367808	\N	\N	\N	\N	{"rating": 4, "reviewText": "Tips for effective reviews\\n• Be honest and constructive in your feedback\\n• Focus on specific contributions and behaviors\\n• Explain the impact of their work on the community\\n• Stay professional and respectful"}	2025-10-27 18:50:24.701103
43	unclaimed_1761598725591_bwyuqfwfn	review	New review received	Masterlife_24 gave you a 5-star review: "Tips for effective reviews\n• Be honest and constru..."	f	/my-reviews	1940567468453367808	\N	\N	\N	\N	{"rating": 5, "reviewText": "Tips for effective reviews\\n• Be honest and constructive in your feedback\\n• Focus on specific contributions and behaviors\\n• Explain the impact of their work on the community\\n• Stay professional and respectful"}	2025-10-27 20:59:31.245766
44	unclaimed_1761996019871_w10xye861	review	New review received	Masterlife_24 gave you a 5-star review: "Tips for effective reviews\n• Be honest and constru..."	f	/my-reviews	1940567468453367808	\N	\N	\N	\N	{"rating": 5, "reviewText": "Tips for effective reviews\\n• Be honest and constructive in your feedback\\n• Focus on specific contributions and behaviors\\n• Explain the impact of their work on the community\\n• Stay professional and respectful"}	2025-11-01 11:21:02.469985
45	unclaimed_1762003515587_tgxl9s7dk	review	New review received	Masterlife_24 gave you a 4-star review: "Tips for effective reviews\n• Be honest and constru..."	f	/my-reviews	1940567468453367808	\N	\N	\N	\N	{"rating": 4, "reviewText": "Tips for effective reviews\\n• Be honest and constructive in your feedback\\n• Focus on specific contributions and behaviors\\n• Explain the impact of their work on the community\\n• Stay professional and respectful"}	2025-11-01 13:26:24.743612
46	unclaimed_1762503476265_91xpb7k0o	review	New review received	Masterlife_24 gave you a 5-star review: "Tips for effective reviews\n• Be honest and constru..."	f	/my-reviews	1940567468453367808	\N	\N	\N	\N	{"rating": 5, "reviewText": "Tips for effective reviews\\n• Be honest and constructive in your feedback\\n• Focus on specific contributions and behaviors\\n• Explain the impact of their work on the community\\n• Stay professional and respectful"}	2025-11-07 08:18:21.402426
\.


--
-- Data for Name: prediction_markets; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.prediction_markets (id, stance_id, market_name, description, outcome_a, outcome_b, total_liquidity, liquidity_a, liquidity_b, price_a, price_b, is_active, is_settled, winning_outcome, total_volume, total_trades, unique_traders, settled_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: project_reviews; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.project_reviews (id, user_id, project_id, project_name, project_logo, project_slug, rating, title, content, helpful, verified, created_at, updated_at, company_reply, company_replied_at) FROM stdin;
1	1940567468453367808	10	KAST	https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&h=200&fit=crop	kast	4	test life	You are the greatest lets go	0	f	2025-11-16 12:21:18.151339	2025-11-16 12:21:18.151339	\N	\N
3	1940567468453367808	10	KAST	https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&h=200&fit=crop	kast	4	test life	kefnkjenfkjerfnrkenfreknfref ernfjkernfkrengkrengvkregnvrekngreklgnvkrelngreklngvrkelnrke	0	f	2025-11-16 12:39:02.584487	2025-11-16 12:39:02.584487	\N	\N
4	1940567468453367808	10	KAST	https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&h=200&fit=crop	kast	5	ejfnjefnjerf	ejfgnjkrebgfjkrebgrjkebgjkrebgjkrebgkrjegbjre	0	f	2025-11-16 12:39:51.895036	2025-11-16 12:39:51.895036	\N	\N
21	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	Life is good	test test test test test test	0	f	2025-11-21 14:47:47.084931	2025-11-21 14:47:47.084931	\N	\N
5	1940567468453367808	10	KAST	https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&h=200&fit=crop	kast	5	mama	I see you there how are you	1	f	2025-11-16 12:40:18.075878	2025-11-16 12:40:18.075878	\N	\N
2	1940567468453367808	10	KAST	https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&h=200&fit=crop	kast	4	Life is good	Tell us how it works	4	f	2025-11-16 12:32:45.350387	2025-11-16 12:32:45.350387	\N	\N
6	1940567468453367808	1	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	New test	Life is good at the top	0	f	2025-11-17 11:18:59.624205	2025-11-17 11:18:59.624205	\N	\N
7	1940567468453367808	1	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	444444	Life is good at the top in the hood	0	f	2025-11-17 11:21:20.995415	2025-11-17 11:21:20.995415	\N	\N
8	1940567468453367808	1	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	4	444444	fhfh4bg4 gb4gbygbyrugtby tvy54tbv5	0	f	2025-11-17 11:25:27.738719	2025-11-17 11:25:27.738719	\N	\N
9	1940567468453367808	1	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	7777777	Share your experience to help others make informed decisions	0	f	2025-11-17 11:33:15.964841	2025-11-17 11:33:15.964841	\N	\N
10	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	3	8888888888888	Share your experience to help others make informed decisions	0	f	2025-11-17 11:37:21.615719	2025-11-17 11:37:21.615719	\N	\N
11	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	9999	hello are you workingn	0	f	2025-11-17 12:41:17.764247	2025-11-17 12:41:17.764247	\N	\N
23	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	njnkjnjkn	nljnjlnjnljnljnljnljnljnlj jnojnonljn jnjnonkj jnunkjb kjbjbbjbnjk kjbujbjlnj bounj jnjnlkn jnjnl. njlknk. lnkjlnkj nklnkl lnknlk nnkln nklnk. nkl l nklnk	0	f	2025-11-23 10:57:57.610655	2025-11-23 10:57:57.610655	\N	\N
24	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	klnlknk 	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	0	f	2025-11-23 10:58:34.772282	2025-11-23 10:58:34.772282	\N	\N
25	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	hjbhjbhb	jkhbjkbjkb bjkbjk. jkbjkbj jbjkb b jkbjk jkb jk jk j.	0	f	2025-11-23 19:20:13.227407	2025-11-23 19:20:13.227407	\N	\N
12	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	4	test 5	life is good	1	f	2025-11-17 12:42:46.081594	2025-11-17 12:42:46.081594	hey there\n	2025-11-18 14:36:06.211
13	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	4	888888888	test me like you know it yeaaahh	1	f	2025-11-17 22:12:43.850525	2025-11-17 22:12:43.850525	life is good 	2025-11-18 14:19:08.969
14	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	4	test3	fjefjfbjkfbjfbj4f ffj4bfjk4bf4	0	f	2025-11-18 16:54:05.593101	2025-11-18 16:54:05.593101	\N	\N
15	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	enfkjsnfkjnfkjnkjrenfj	lol it cool this card I like itTips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	0	f	2025-11-20 15:25:09.452763	2025-11-20 15:25:09.452763	\N	\N
16	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	hjkbhjbhbjkhb	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	0	f	2025-11-20 15:28:32.618228	2025-11-20 15:28:32.618228	\N	\N
17	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	fbhjewbfhhjewbfehjw	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	1	f	2025-11-20 16:49:28.373414	2025-11-20 16:49:28.373414	\N	\N
18	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	fmefb je ffnjfnf 	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	0	f	2025-11-20 17:10:25.927276	2025-11-20 17:10:25.927276	\N	\N
19	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	New Life Test	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	0	f	2025-11-20 17:29:24.103662	2025-11-20 17:29:24.103662	\N	\N
26	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	hjbhjbhb	jkhbjkbjkb bjkbjk. jkbjkbj jbjkb b jkbjk jkb jk jk j.	0	f	2025-11-23 19:20:19.921266	2025-11-23 19:20:19.921266	\N	\N
27	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	hjbhjbhb	jkhbjkbjkb bjkbjk. jkbjkbj jbjkb b jkbjk jkb jk jk j.	0	f	2025-11-23 19:20:37.817325	2025-11-23 19:20:37.817325	\N	\N
28	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	hjbhjbhb	jkhbjkbjkb bjkbjk. jkbjkbj jbjkb b jkbjk jkb jk jk j.	0	f	2025-11-23 19:22:07.700315	2025-11-23 19:22:07.700315	\N	\N
29	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	hjbhjbhb	jkhbjkbjkb bjkbjk. jkbjkbj jbjkb b jkbjk jkb jk jk j.	0	f	2025-11-23 19:22:20.290308	2025-11-23 19:22:20.290308	\N	\N
30	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	hjbhjbhb	jkhbjkbjkb bjkbjk. jkbjkbj jbjkb b jkbjk jkb jk jk j.	0	f	2025-11-23 19:22:40.674529	2025-11-23 19:22:40.674529	\N	\N
31	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	vjnvjtnjtnv t t t	fhrhhgjrbgrh ghrjgbhrg rghrgr ghrjghrg rhgbrhg rhgbrhjg erehjgerhjg er	0	f	2025-11-24 13:56:54.535699	2025-11-24 13:56:54.535699	\N	\N
32	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	test life	bhjbhjb bbjubkjn bknjn. nbjjk	0	f	2025-11-24 14:20:45.104982	2025-11-24 14:20:45.104982	\N	\N
33	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	test life	bhjbhjb bbjubkjn bknjn. nbjjk	0	f	2025-11-24 14:20:54.289726	2025-11-24 14:20:54.289726	\N	\N
34	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	Life is good	ehfbhjebff ehjbfhejffbbf fhebfhbf	0	f	2025-11-24 15:29:56.906053	2025-11-24 15:29:56.906053	\N	\N
35	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	test life	bhjbjhb jhbhjbhj bhjbhjb jbhjbjh	0	f	2025-11-24 15:33:01.526042	2025-11-24 15:33:01.526042	\N	\N
36	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	When its good	Tell us about your life mate	0	f	2025-11-24 17:57:37.968736	2025-11-24 17:57:37.968736	\N	\N
37	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	njknjknjknk	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	0	f	2025-11-24 17:59:47.647919	2025-11-24 17:59:47.647919	\N	\N
38	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	jrrgjrgbjrgb 	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	0	f	2025-11-24 19:32:18.704257	2025-11-24 19:32:18.704257	\N	\N
39	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	jnjknjkfngjkfng	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	0	f	2025-11-24 20:27:08.687705	2025-11-24 20:27:08.687705	\N	\N
40	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	mklmklm klmkl 	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	0	f	2025-11-24 21:12:56.5132	2025-11-24 21:12:56.5132	\N	\N
41	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	njhnjn	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	0	f	2025-11-24 21:31:17.56173	2025-11-24 21:31:17.56173	\N	\N
42	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	bjbhjbjkhb	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	0	f	2025-11-24 21:45:16.208494	2025-11-24 21:45:16.208494	\N	\N
43	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	jkbjhb bjhbjh 	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community	0	f	2025-11-24 21:56:43.1409	2025-11-24 21:56:43.1409	\N	\N
44	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	 h hj hjk	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	0	f	2025-11-24 22:04:05.221015	2025-11-24 22:04:05.221015	\N	\N
45	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	h j jh	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	0	f	2025-11-24 22:06:15.058485	2025-11-24 22:06:15.058485	\N	\N
46	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	bhbhjb bjh 	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respec	0	f	2025-11-24 22:22:34.114871	2025-11-24 22:22:34.114871	\N	\N
47	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	nbhjbnhjb. bhjbhj	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	0	f	2025-11-24 22:45:35.888508	2025-11-24 22:45:35.888508	\N	\N
48	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	4	BHHJBHJBHJD	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	0	f	2025-11-25 01:03:00.836867	2025-11-25 01:03:00.836867	\N	\N
49	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	the top is a must place	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specif	0	f	2025-11-25 14:11:39.771573	2025-11-25 14:11:39.771573	\N	\N
50	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	hjgjhgygyg	Tips for effective reviews\n• Be honest and constructive in your feedback	0	f	2025-11-25 14:18:42.967569	2025-11-25 14:18:42.967569	\N	\N
51	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	google 	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific cont	0	f	2025-11-25 14:44:55.083781	2025-11-25 14:44:55.083781	\N	\N
52	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	4	jnjnn	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on s	0	f	2025-11-25 15:10:25.321207	2025-11-25 15:10:25.321207	\N	\N
53	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	4	gdhddudn diid 	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	0	f	2025-11-25 15:32:06.519607	2025-11-25 15:32:06.519607	\N	\N
54	1940567468453367808	3	Trust Wallet	https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=120&h=120&fit=crop	trust-wallet	4	bhjbhbhj 	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectf	0	f	2025-11-25 15:38:35.857194	2025-11-25 15:38:35.857194	\N	\N
55	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	New 11111	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay profess	0	f	2025-11-26 13:26:52.127483	2025-11-26 13:26:52.127483	\N	\N
56	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	5	444444	rjefefuefneuifnehuirfhr	0	f	2025-11-26 17:57:13.554642	2025-11-26 17:57:13.554642	\N	\N
57	1940567468453367808	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	kast	4	kejkenfujerunfjruf	ejfkhnurejnfuernf frjkbfgerjbgjergfbreugfjeioufj4if	0	f	2025-11-26 17:57:41.761793	2025-11-26 17:57:41.761793	\N	\N
\.


--
-- Data for Name: quest_tasks; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.quest_tasks (id, quest_id, task_type, description, target_value, created_at, target_user_id, target_stance_id, target_dao_id, sort_order) FROM stdin;
1	1	vote_proposal	Vote on 2 governance proposals	2	2025-08-06 14:24:51.962588	\N	\N	\N	0
2	1	comment_proposal	Comment on 1 proposal	1	2025-08-06 14:24:51.962588	\N	\N	\N	0
3	1	review_member	Review 1 community member	1	2025-08-06 14:24:51.962588	\N	\N	\N	0
4	2	vote_proposal	Vote on 5 governance proposals	5	2025-08-06 14:24:56.70311	\N	\N	\N	0
5	2	comment_proposal	Comment on 3 proposals with quality feedback	3	2025-08-06 14:24:56.70311	\N	\N	\N	0
6	2	review_member	Complete 2 thoughtful member reviews	2	2025-08-06 14:24:56.70311	\N	\N	\N	0
7	2	create_stance	Create 1 governance stance	1	2025-08-06 14:24:56.70311	\N	\N	\N	0
17	6	stance_created	Share your first stance on a governance issue	1	2025-08-10 21:23:20.851353	\N	\N	\N	0
18	6	normal_comment	Add your first comment to a discussion	1	2025-08-10 21:23:20.924691	\N	\N	\N	1
20	6	review_member	Write a review for a community member	1	2025-08-10 21:23:21.062745	\N	\N	\N	3
19	6	vote_cast	Cast your first vote on a governance stance	1	2025-08-10 21:23:20.991348	\N	\N	\N	2
\.


--
-- Data for Name: quests; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.quests (id, title, description, quest_type, status, xp_reward, xp_prize_pool, max_winners, current_winners, duration_hours, xp_requirement, created_by, created_at, updated_at, ends_at) FROM stdin;
1	Governance Explorer	Welcome to DAO AI! Complete these tasks to learn the platform and earn your first XP rewards.	starter	ended	500	\N	\N	0	12	\N	system	2025-08-06 14:24:48.732363	2025-08-08 17:16:47.649	\N
4	Arbitrum Challenge	No tasks added yet. Click "Add Task" to start building your quest	special	ended	\N	10000	11	0	6	20	admin	2025-08-06 22:41:14.18918	2025-08-10 21:21:54.011	\N
2	DAO Engagement Challenge	Special limited-time quest for active governance participants. Top performers share the XP prize pool!	special	ended	\N	1000	5	0	48	500	system	2025-08-06 14:24:54.634478	2025-08-10 21:22:20.591	\N
6	DAO AI Welcome Quest	Welcome to DAO AI! Complete these tasks within 24 hours earn your first boosted XP rewards.	welcome	active	525	\N	\N	0	24	\N	system	2025-08-10 20:54:35.448372	2025-08-10 21:23:20.672	\N
\.


--
-- Data for Name: referrals; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.referrals (id, referrer_id, referred_id, referral_code, points_awarded, created_at) FROM stdin;
\.


--
-- Data for Name: review_comments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.review_comments (id, content, author_id, review_id, upvotes, downvotes, created_at, updated_at, parent_comment_id) FROM stdin;
1	Bullish on this	1940567468453367808	4	0	0	2025-07-28 16:25:38.982313	2025-07-28 16:25:38.982313	\N
2	Bullish on this	1940567468453367808	1	0	0	2025-07-28 16:26:20.176129	2025-07-28 16:26:20.176129	\N
3	hello test	1940567468453367808	4	0	0	2025-07-28 16:29:38.36354	2025-07-28 16:29:38.36354	\N
4	Glad to be here	1940567468453367808	1	0	0	2025-07-28 16:30:04.295293	2025-07-28 16:30:04.295293	\N
5	hello	1940567468453367808	4	0	0	2025-07-28 16:31:40.369871	2025-07-28 16:31:40.369871	\N
6	Test again	1940567468453367808	4	0	0	2025-07-28 16:35:56.571938	2025-07-28 16:35:56.571938	\N
7	test	1940567468453367808	23	0	0	2025-08-05 10:38:53.071844	2025-08-05 10:38:53.071844	\N
8	Test 2	1940567468453367808	23	0	0	2025-08-05 10:48:42.056421	2025-08-05 10:48:42.056421	\N
9	hello	1943623053071765504	29	0	0	2025-08-11 18:41:04.468037	2025-08-11 18:41:04.468037	\N
10	hello	1940567468453367808	33	0	0	2025-08-14 10:45:22.421901	2025-08-14 10:45:22.421901	\N
11	hi	1940567468453367808	32	0	0	2025-08-14 10:46:13.814764	2025-08-14 10:46:13.814764	\N
12	hello	1940567468453367808	30	0	0	2025-08-14 10:52:46.614176	2025-08-14 10:52:46.614176	\N
13	Hello	1955633228036886528	32	0	0	2025-08-14 11:20:12.889993	2025-08-14 11:20:12.889993	\N
14	hello	1955633228036886528	31	0	0	2025-08-14 11:24:06.656349	2025-08-14 11:24:06.656349	\N
15	hello	1940567468453367808	28	0	0	2025-08-14 11:38:59.492475	2025-08-14 11:38:59.492475	\N
16	Google is the real deal.	1955633228036886528	12	0	0	2025-08-14 12:25:23.556481	2025-08-14 12:25:23.556481	\N
17	heloooo life is good right	1940567468453367808	35	0	0	2025-09-03 10:26:52.872523	2025-09-03 10:26:52.872523	\N
18	Life is good lets get it	unclaimed_1753906423772_4aedo5x3t	35	0	0	2025-09-03 10:41:52.990514	2025-09-03 10:41:52.990514	\N
19	Life is good @daomasawi	unclaimed_1753906423772_4aedo5x3t	36	0	0	2025-09-03 11:16:29.984101	2025-09-03 11:16:29.984101	\N
20	Hello	unclaimed_1753906423772_4aedo5x3t	36	0	0	2025-09-06 21:11:39.796017	2025-09-06 21:11:39.796017	\N
21	nm. jn kj jk	1940567468453367808	37	0	0	2025-09-07 22:32:44.767571	2025-09-07 22:32:44.767571	\N
\.


--
-- Data for Name: review_reports; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.review_reports (id, review_id, reported_by, reason, status, created_at, notes) FROM stdin;
3	21	1940567468453367808	inappropriate	pending	2025-11-23 09:55:47.862782	lige is njkendjkedn
5	23	1940567468453367808	misleading	pending	2025-11-23 13:54:20.741378	\N
6	24	1940567468453367808	offensive	pending	2025-11-23 14:04:05.288317	\N
7	30	1940567468453367808	misleading	pending	2025-11-24 13:50:34.340959	\N
8	35	1940567468453367808	inappropriate	pending	2025-11-24 16:15:10.773481	\N
9	35	1940567468453367808	offensive	pending	2025-11-24 16:25:49.580967	\N
\.


--
-- Data for Name: review_share_clicks; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.review_share_clicks (id, share_token, clicked_at, ip_address, user_agent, referrer, converted_to_user_id) FROM stdin;
\.


--
-- Data for Name: review_shares; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.review_shares (id, user_id, review_id, project_id, project_name, project_logo, share_token, creda_earned, platform, clicks, conversions, share_reward_claimed, share_reward_claimed_at, created_at) FROM stdin;
8	1940567468453367808	55	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	l6zuykixydjg9ovndb2qlt	20	twitter	0	0	f	\N	2025-11-26 13:26:53.438536
7	1940567468453367808	55	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	iuzo6pavwy9xskf8l40nq	20	twitter	0	0	t	2025-11-26 13:27:16.121	2025-11-26 13:26:53.10714
9	1940567468453367808	57	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	77grpbct2oik97xbg3iuel	20	twitter	0	0	f	\N	2025-11-26 17:57:42.999704
10	1940567468453367808	57	10	KAST	/public-objects/logos/78085046-0fc3-4ecc-8b26-24de33997bb7	qxspei66i2olyza4zafjaj	20	twitter	0	0	f	\N	2025-11-26 17:57:43.335733
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.reviews (id, reviewer_id, reviewed_id, reviewed_user_id, reviewed_dao_id, target_type, is_target_on_platform, external_entity_name, external_entity_x_handle, review_type, rating, content, points_awarded, upvotes, downvotes, created_at, updated_at, title, helpful_count, space_id, reviewed_business_id, company_reply, company_replied_at) FROM stdin;
1	1940567468453367808	\N	unclaimed_1753701743381_69oe5eznf	\N	user	t	\N	\N	positive	5	DAO AI is introducing a refreshing approach to Governance and much needed approach. Team has been building for many months now and the quality of the product and UI speaks for its self excited for this one. \n\nCongrats and keep building...	5	1	0	2025-07-28 13:49:42.552066	2025-07-28 15:27:11.079	\N	0	\N	\N	\N	\N
4	1940567468453367808	\N	unclaimed_1753718596277_lxvbe0r2g	\N	user	t	\N	\N	positive	5	I've come across a lot of strong proposals and governance proposals by these guys pretty solid highly respected. 	5	1	0	2025-07-28 16:05:50.449755	2025-07-28 16:35:43.123	\N	0	\N	\N	\N	\N
12	1940567468453367808	\N	unclaimed_1753893705381_eeppyn035	\N	user	t	\N	\N	positive	5	Has pushed the boundaries for Balancer DAO and is highly knowledgeable a true legend and an OG. 	5	1	0	2025-07-30 16:43:00.891669	2025-07-30 17:32:21.101	\N	0	\N	\N	\N	\N
13	1940567468453367808	\N	unclaimed_1753896873146_gnsrpgoq5	\N	user	t	\N	\N	positive	4	Added some value to the space not sure who here is tbh	5	0	0	2025-07-30 17:35:21.168151	2025-07-30 17:35:21.168151	\N	0	\N	\N	\N	\N
14	1940567468453367808	\N	unclaimed_1753906423772_4aedo5x3t	\N	user	t	\N	\N	positive	5	Good insight from what I've seen great proposals coming from what they bring to the table	5	0	0	2025-07-30 20:14:57.316756	2025-07-30 20:14:57.316756	\N	0	\N	\N	\N	\N
8	1940567468453367808	\N	\N	1	dao	t	\N	\N	positive	5	This is probably one of the best run DAOs OGs that have been in the space for a long time and have set the standard for the space	5	0	0	2025-07-30 14:41:04.076669	2025-07-30 14:41:04.076669	\N	0	\N	\N	\N	\N
5	1940567468453367808	\N	\N	7	dao	t	\N	\N	positive	5	Very active goverance community they keep pushing the boundaries of what is possible in the space. \n\nExcited for the next set of proposals upcoming. 	5	0	0	2025-07-28 19:37:51.168735	2025-07-28 19:37:51.168735	\N	0	\N	\N	\N	\N
15	1940567468453367808	\N	\N	8	dao	t	\N	\N	positive	5	Upcoming DAO with a great community and has been working day and night to excecute	5	0	0	2025-07-31 13:50:46.737984	2025-07-31 13:50:46.737984	\N	0	\N	\N	\N	\N
16	1940567468453367808	\N	\N	9	dao	t	\N	\N	positive	5	This is a test life is good this is a test life is good life is good test test test	5	0	0	2025-07-31 14:29:32.017743	2025-07-31 14:29:32.017743	\N	0	\N	\N	\N	\N
17	1940567468453367808	\N	unclaimed_1753976411439_e6jc6s5w5	\N	user	t	\N	\N	positive	5	The quick brown foxed jumped over the fence. The it jumped again and again	5	0	0	2025-07-31 15:43:11.368902	2025-07-31 15:43:11.368902	\N	0	\N	\N	\N	\N
18	1940567468453367808	\N	\N	10	dao	t	\N	\N	positive	4	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their wo	5	0	0	2025-07-31 21:09:02.411688	2025-07-31 21:09:02.411688	\N	0	\N	\N	\N	\N
19	1940567468453367808	\N	\N	11	dao	t	\N	\N	positive	5	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	5	0	0	2025-07-31 21:25:13.870551	2025-07-31 21:25:13.870551	\N	0	\N	\N	\N	\N
20	1940567468453367808	\N	\N	12	dao	t	\N	\N	negative	5	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	5	0	0	2025-08-01 10:53:47.111403	2025-08-01 10:53:47.111403	\N	0	\N	\N	\N	\N
21	1940567468453367808	\N	unclaimed_1754047107989_jorwaa1d2	\N	user	t	\N	\N	negative	4	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	5	1	0	2025-08-01 11:18:58.297742	2025-08-01 11:24:29.584	\N	0	\N	\N	\N	\N
22	1940567468453367808	\N	\N	14	dao	t	\N	\N	positive	5	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	5	0	0	2025-08-01 11:45:32.850581	2025-08-01 11:45:32.850581	\N	0	\N	\N	\N	\N
23	1940567468453367808	\N	unclaimed_1754048806293_3eppwfq0a	\N	user	t	\N	\N	negative	4	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	5	0	0	2025-08-01 11:47:06.485878	2025-08-01 11:47:06.485878	\N	0	\N	\N	\N	\N
24	1940567468453367808	\N	unclaimed_1754334930623_nayncpsyk	\N	user	t	\N	\N	positive	5	I met the founder of DAO AI in Dubai during the private event! \n\nHe laid out an ambitious vision for what a true reputation-driven governance platform could look like. \n\nIt was bold, clear, and rooted in a deep understanding of the problems DAOs face today. Seeing that vision now come to life—and being invited as one of the early users—has been incredibly rewarding. \n\nHis enthusiasm, passion, and drive are infectious. You can tell he’s not just building a product, but solving a problem he genuinely cares about. He’s clearly a builder at heart, but also has the long-term mindset and clarity you want in a founder. It’s refreshing to see this level of dedication in the crypto space, where noise often drowns out real innovation. DAO AI is a much-needed tool, and I’m excited to see where it goes next.	5	0	0	2025-08-05 12:42:35.684595	2025-08-05 12:42:35.684595	Exceptional Leadrship Ability	0	\N	\N	\N	\N
25	1940567468453367808	\N	\N	18	dao	t	\N	\N	positive	5	I met the founder of DAO AI in Dubai during the private event! \n\nHe laid out an ambitious vision for what a true reputation-driven governance platform could look like. \n\nIt was bold, clear, and rooted in a deep understanding of the problems DAOs face today. Seeing that vision now come to life—and being invited as one of the early users—has been incredibly rewarding. \n\nHis enthusiasm, passion, and drive are infectious. You can tell he’s not just building a product, but solving a problem he genuinely cares about. \n\nHe’s clearly a builder at heart, but also has the long-term mindset and clarity you want in a founder. It’s refreshing to see this level of dedication in the crypto space, where noise often drowns out real innovation. DAO AI is a much-needed tool, and I’m excited to see where it goes next.	5	1	0	2025-08-05 14:28:04.204377	2025-08-05 14:28:37.396	Life is good DAO 	0	\N	\N	\N	\N
26	1940567468453367808	\N	unclaimed_1754350236092_z31grdc8w	\N	user	t	\N	\N	positive	5	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	5	0	0	2025-08-05 21:03:16.121911	2025-08-05 21:03:16.121911	Good user	0	\N	\N	\N	\N
27	1940567468453367808	\N	unclaimed_1754443622811_h0dewav4n	\N	user	t	\N	\N	negative	5	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	5	0	0	2025-08-06 01:28:03.085862	2025-08-06 01:28:03.085862	njknjknjk 	0	\N	\N	\N	\N
28	1953113551893073922	\N	unclaimed_1754931413976_tdkck1zod	\N	user	t	\N	\N	positive	5	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	5	0	0	2025-08-11 16:59:05.863138	2025-08-11 16:59:05.863138	test 777777	0	\N	\N	\N	\N
29	1953113551893073922	\N	1940567468453367808	\N	user	t	\N	\N	positive	5	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	5	0	0	2025-08-11 17:07:51.38996	2025-08-11 17:07:51.38996	DAO Life is good	0	\N	\N	\N	\N
30	1943623053071765504	\N	unclaimed_1754334930623_nayncpsyk	\N	user	t	\N	\N	positive	5	Tips for effective reviews\n\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	5	0	0	2025-08-11 18:48:24.306719	2025-08-11 18:48:24.306719	Life is good 	0	\N	\N	\N	\N
31	1943623053071765504	\N	unclaimed_1753906423772_4aedo5x3t	\N	user	t	\N	\N	positive	5	Tips for effective reviews\n\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	5	0	0	2025-08-11 19:02:02.586673	2025-08-11 19:02:02.586673	bhjbhjbjhb	0	\N	\N	\N	\N
32	1955002803245682690	\N	unclaimed_1754334930623_nayncpsyk	\N	user	t	\N	\N	positive	5	Tips for effective reviews\n\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	5	0	0	2025-08-11 20:44:01.611911	2025-08-11 20:44:01.611911	bhbhbhb	0	\N	\N	\N	\N
33	1955002803245682690	\N	unclaimed_1753701743381_69oe5eznf	\N	user	t	\N	\N	negative	1	Tips for effective reviews\n\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	5	0	0	2025-08-11 21:08:00.556772	2025-08-11 21:08:00.556772	76786876	0	\N	\N	\N	\N
36	unclaimed_1753906423772_4aedo5x3t	\N	unclaimed_1753701743381_69oe5eznf	\N	user	t	\N	\N	negative	5	Tips for effective stances\n\n• Be specific and provide concrete examples\n• Link to original proposals when possible\n• Explain the potential impact of your stance\n• Stay professional and constructive	5	1	0	2025-09-03 11:05:51.532224	2025-09-03 11:28:44.772	Hgygygyugyu	0	\N	\N	\N	\N
42	1940567468453367808	\N	unclaimed_1761598725591_bwyuqfwfn	\N	user	t	\N	\N	negative	5	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	5	0	0	2025-10-27 20:59:29.636657	2025-10-27 20:59:29.636657	nefnefh	0	1	\N	\N	\N
37	1940567468453367808	\N	unclaimed_1756898901215_md90l482r	\N	user	t	\N	\N	neutral	5	:loudspeaker: Platform Upgrade Notice @everyone @Verified \n\nHey everyone! :wave:\n\nWe’re currently rolling out some upgrades to DAO AI to bring you a smoother and more powerful experience. :rocket:\n\nDuring this time, you may notice a few interruptions or temporary downtime on the platform. Don’t worry — everything will be back shortly and better than ever. :muscle:\n\nThanks for your patience and for being part of this journey with us :pray:	5	2	0	2025-09-03 11:28:36.92416	2025-09-04 19:33:54.616	njeknfjkenfje	0	\N	\N	\N	\N
34	1940567468453367808	\N	unclaimed_1755544824214_l8o9ouoxv	\N	user	t	\N	\N	positive	5	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	5	1	0	2025-08-18 19:20:50.627039	2025-09-04 21:14:36.378	njefnjekfnejkfner	0	\N	\N	\N	\N
35	unclaimed_1753906423772_4aedo5x3t	\N	unclaimed_1754334930623_nayncpsyk	\N	user	t	\N	\N	positive	5	Tips for effective reviews\n\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	5	1	0	2025-09-03 08:38:48.911478	2025-09-06 21:04:18.525	Man with a plan	0	\N	\N	\N	\N
38	unclaimed_1753906423772_4aedo5x3t	\N	1940567468453367808	\N	user	t	\N	\N	negative	5	Tips for effective reviews\n\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	5	0	0	2025-09-06 21:12:29.024918	2025-09-06 21:12:29.024918	Jehfjehfur bfjhrkebfrf	0	\N	\N	\N	\N
39	1940567468453367808	\N	unclaimed_1761057399602_oj87lsf6d	\N	user	t	\N	\N	positive	4	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	5	1	0	2025-10-21 14:36:46.384712	2025-10-21 14:38:08.586	Life is good at the top	0	1	\N	\N	\N
40	1940567468453367808	\N	unclaimed_1761077625620_h9olo856d	\N	user	t	\N	\N	positive	4	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectfu	5	0	0	2025-10-21 20:14:10.710895	2025-10-21 20:14:10.710895	bhbhbhjb	0	1	\N	\N	\N
41	1940567468453367808	\N	unclaimed_1761590984358_cylskgzq6	\N	user	t	\N	\N	positive	4	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	5	0	0	2025-10-27 18:50:23.098492	2025-10-27 18:50:23.098492	life is good 	0	1	\N	\N	\N
43	1940567468453367808	\N	unclaimed_1761996019871_w10xye861	\N	user	t	\N	\N	negative	5	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	5	0	0	2025-11-01 11:21:00.777493	2025-11-01 11:21:00.777493	New Actor Like Mike	0	1	\N	\N	\N
44	1940567468453367808	\N	unclaimed_1762003515587_tgxl9s7dk	\N	user	t	\N	\N	negative	4	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	5	0	0	2025-11-01 13:26:23.031139	2025-11-01 13:26:23.031139	Life is amazing 	0	1	\N	\N	\N
45	1940567468453367808	\N	unclaimed_1762503476265_91xpb7k0o	\N	user	t	\N	\N	positive	5	Tips for effective reviews\n• Be honest and constructive in your feedback\n• Focus on specific contributions and behaviors\n• Explain the impact of their work on the community\n• Stay professional and respectful	5	0	0	2025-11-07 08:18:19.795698	2025-11-07 08:18:19.795698	nnfjefn	0	1	\N	\N	\N
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sessions (sid, sess, expire) FROM stdin;
XzmZlpwdjXoBLryuuIRjYRnGtd9l6b9J	{"cookie": {"path": "/", "secure": false, "expires": "2025-12-03T17:40:14.492Z", "httpOnly": true, "originalMaxAge": 604800000}, "passport": {"user": {"id": "1940567468453367808", "bio": null, "email": null, "grsScore": 2800, "lastName": null, "password": null, "username": "Masterlife_24", "access_id": "1940567468453367808", "claimedAt": null, "createdAt": "2025-07-24T20:28:27.350Z", "createdBy": null, "firstName": "Masterlife24", "githubUrl": null, "invitedBy": null, "isClaimed": true, "updatedAt": "2025-11-26T17:40:14.289Z", "twitterUrl": "https://x.com/Masterlife_24", "credaPoints": 9630, "dailyStreak": 1, "isSuspended": false, "linkedinUrl": null, "profileType": "member", "suspendedAt": null, "weeklyCreda": 7090, "authProvider": "twitter", "referralCode": "MTk0MDU2", "discordHandle": null, "emailVerified": false, "grsPercentile": 95, "longestStreak": 2, "twitterHandle": "Masterlife_24", "walletAddress": null, "inviteCodeUsed": null, "lastActiveDate": "2025-07-28T13:49:42.787Z", "lastStreakDate": "2025-10-21T00:00:00.000Z", "telegramHandle": null, "hasInviteAccess": true, "profileImageUrl": "https://pbs.twimg.com/profile_images/1951595838657941504/iw5kUWCF_normal.jpg", "suspensionReason": null, "totalInvitesSent": 0, "successfulInvites": 0, "isUnclaimedProfile": false, "lastCredaWeekReset": "2025-07-24T20:28:27.350Z", "profileCompletedAt": null, "governanceInterests": null, "inviteCodesAvailable": 3, "fullAccessActivatedAt": "2025-08-10T22:09:58.821Z", "onboardingCompletedAt": null, "lastInviteCredaMilestone": 0, "walletVerificationTxHash": null}}, "inClaimingFlow": false, "hasClaimableProfiles": false}	2025-12-04 22:37:59
CawrqUsYi_1t2dQgSraFdwpkEFu57_Tn	{"cookie": {"path": "/", "secure": false, "expires": "2025-11-25T20:02:31.755Z", "httpOnly": true, "originalMaxAge": 604800000}, "passport": {"user": {"id": "1940567468453367808", "bio": null, "email": null, "grsScore": 2800, "lastName": null, "password": null, "username": "Masterlife_24", "weeklyXp": 1865, "xpPoints": 4405, "access_id": "1940567468453367808", "claimedAt": null, "createdAt": "2025-07-24T20:28:27.350Z", "createdBy": null, "firstName": "Masterlife24", "githubUrl": null, "invitedBy": null, "isClaimed": true, "updatedAt": "2025-11-17T19:34:36.622Z", "twitterUrl": "https://x.com/Masterlife_24", "dailyStreak": 1, "linkedinUrl": null, "profileType": "member", "authProvider": "twitter", "referralCode": "MTk0MDU2", "discordHandle": null, "emailVerified": false, "grsPercentile": 95, "longestStreak": 2, "twitterHandle": "Masterlife_24", "walletAddress": "0xad42032d6bb4b1cf3fa780405daeb2392786abd9", "inviteCodeUsed": null, "lastActiveDate": "2025-07-28T13:49:42.787Z", "lastStreakDate": "2025-10-21T00:00:00.000Z", "telegramHandle": null, "hasInviteAccess": true, "lastXpWeekReset": "2025-07-24T20:28:27.350Z", "profileImageUrl": "https://pbs.twimg.com/profile_images/1951595838657941504/iw5kUWCF_normal.jpg", "totalInvitesSent": 0, "successfulInvites": 0, "isUnclaimedProfile": false, "profileCompletedAt": null, "governanceInterests": null, "inviteCodesAvailable": 3, "fullAccessActivatedAt": "2025-08-10T22:09:58.821Z", "lastInviteXpMilestone": 0, "onboardingCompletedAt": null, "walletVerificationTxHash": "0xe72754006499b59e4e8dd356880d08c7afb17b769551fbe73f9fa02de782545c"}}, "companyId": 1, "companyUserId": 1, "inClaimingFlow": false, "adminAuthenticated": true, "hasClaimableProfiles": false}	2025-12-02 19:34:57
\.


--
-- Data for Name: space_activities; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.space_activities (id, space_id, user_id, activity_type, title, description, metadata, created_at) FROM stdin;
\.


--
-- Data for Name: space_members; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.space_members (id, space_id, user_id, role, joined_at) FROM stdin;
\.


--
-- Data for Name: space_votes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.space_votes (id, space_id, user_id, vote_type, created_at, comment, updated_at) FROM stdin;
1	1	1940567468453367808	bullish	2025-11-01 18:34:28.765	\N	2025-11-01 22:30:57.019
\.


--
-- Data for Name: spaces; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.spaces (id, name, slug, description, logo_url, category, tags, is_active, is_verified, member_count, bullish_votes, bearish_votes, total_votes, view_count, created_at, updated_at, created_by, badge, gradient) FROM stdin;
1	Jaine	jaine	JAINE is an AI native liquidity engine on 0G, an AI operating system; characterised as an "Intelligent AMM".	https://pbs.twimg.com/profile_images/1940378940960284672/2zshWNfT_400x400.jpg	\N	{}	t	f	0	1	0	1	0	2025-10-20 18:16:18.774911	2025-11-01 22:30:57.22	\N	Infrastructure	from-blue-600 via-purple-600 to-indigo-700
\.


--
-- Data for Name: stance_votes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.stance_votes (id, stance_id, user_id, vote_type, created_at) FROM stdin;
1	4	1940567468453367808	champion	2025-07-29 21:04:12.049878
2	4	unclaimed_1753701743381_69oe5eznf	oppose	2025-07-29 21:04:12.049878
3	4	unclaimed_1753718596277_lxvbe0r2g	champion	2025-07-29 21:04:12.049878
5	5	1940567468453367808	champion	2025-08-01 18:37:39.764
6	6	unclaimed_1754350236092_z31grdc8w	champion	2025-08-04 23:58:21.854211
7	6	1940567468453367808	champion	2025-08-05 15:40:16.894979
8	9	1940567468453367808	champion	2025-08-11 00:45:46.259071
9	9	1953113551893073922	champion	2025-08-11 00:50:06.196742
10	9	1943623053071765504	champion	2025-08-11 18:44:13.304674
11	10	1955002803245682690	champion	2025-08-11 21:04:17.310564
12	16	unclaimed_1753906423772_4aedo5x3t	champion	2025-09-03 08:36:10.010388
13	29	1940567468453367808	champion	2025-09-06 11:44:32.992641
14	28	1940567468453367808	champion	2025-09-06 20:55:43.181337
15	28	unclaimed_1753906423772_4aedo5x3t	champion	2025-09-06 21:10:28.005283
16	31	unclaimed_1753906423772_4aedo5x3t	champion	2025-09-06 22:55:36.32866
17	31	1940567468453367808	champion	2025-09-06 22:57:54.709692
18	30	unclaimed_1753906423772_4aedo5x3t	champion	2025-09-06 22:58:41.70487
\.


--
-- Data for Name: user_dao_follows; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_dao_follows (id, user_id, dao_id, created_at) FROM stdin;
1	1940567468453367808	7	2025-07-28 20:41:00.625755
2	1940567468453367808	18	2025-08-11 00:15:20.806279
3	1940567468453367808	3	2025-08-11 00:15:55.926409
\.


--
-- Data for Name: user_dao_scores; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_dao_scores (id, user_id, dao_id, score, created_at, updated_at) FROM stdin;
1	unclaimed_1753701743381_69oe5eznf	1	0	2025-07-28 11:22:23.623011	2025-07-28 11:22:23.623011
2	unclaimed_1753701743381_69oe5eznf	2	0	2025-07-28 11:22:23.695874	2025-07-28 11:22:23.695874
4	unclaimed_1753701743381_69oe5eznf	4	0	2025-07-28 11:22:23.825491	2025-07-28 11:22:23.825491
5	unclaimed_1753701743381_69oe5eznf	5	0	2025-07-28 11:22:23.889997	2025-07-28 11:22:23.889997
6	unclaimed_1753718596277_lxvbe0r2g	1	0	2025-07-28 16:03:16.51904	2025-07-28 16:03:16.51904
7	unclaimed_1753718596277_lxvbe0r2g	2	0	2025-07-28 16:03:16.594886	2025-07-28 16:03:16.594886
9	unclaimed_1753718596277_lxvbe0r2g	4	0	2025-07-28 16:03:16.725815	2025-07-28 16:03:16.725815
10	unclaimed_1753718596277_lxvbe0r2g	5	0	2025-07-28 16:03:16.793719	2025-07-28 16:03:16.793719
21	unclaimed_1753893705381_eeppyn035	1	0	2025-07-30 16:41:45.641644	2025-07-30 16:41:45.641644
22	unclaimed_1753893705381_eeppyn035	2	0	2025-07-30 16:41:45.721182	2025-07-30 16:41:45.721182
24	unclaimed_1753893705381_eeppyn035	4	0	2025-07-30 16:41:45.852472	2025-07-30 16:41:45.852472
25	unclaimed_1753893705381_eeppyn035	5	0	2025-07-30 16:41:45.918839	2025-07-30 16:41:45.918839
26	unclaimed_1753893705381_eeppyn035	7	0	2025-07-30 16:41:45.984897	2025-07-30 16:41:45.984897
27	unclaimed_1753896873146_gnsrpgoq5	1	0	2025-07-30 17:34:33.388481	2025-07-30 17:34:33.388481
28	unclaimed_1753896873146_gnsrpgoq5	2	0	2025-07-30 17:34:33.45697	2025-07-30 17:34:33.45697
30	unclaimed_1753896873146_gnsrpgoq5	4	0	2025-07-30 17:34:33.586581	2025-07-30 17:34:33.586581
31	unclaimed_1753896873146_gnsrpgoq5	5	0	2025-07-30 17:34:33.651598	2025-07-30 17:34:33.651598
32	unclaimed_1753896873146_gnsrpgoq5	7	0	2025-07-30 17:34:33.716922	2025-07-30 17:34:33.716922
33	1940567468453367808	1	0	2025-07-30 17:55:23.601773	2025-07-30 17:55:23.601773
34	1940567468453367808	2	0	2025-07-30 17:55:23.675939	2025-07-30 17:55:23.675939
36	1940567468453367808	4	0	2025-07-30 17:55:23.805302	2025-07-30 17:55:23.805302
37	1940567468453367808	5	0	2025-07-30 17:55:23.869754	2025-07-30 17:55:23.869754
38	1940567468453367808	7	0	2025-07-30 17:55:23.9342	2025-07-30 17:55:23.9342
39	unclaimed_1753906423772_4aedo5x3t	1	0	2025-07-30 20:13:44.023761	2025-07-30 20:13:44.023761
40	unclaimed_1753906423772_4aedo5x3t	2	0	2025-07-30 20:13:44.103496	2025-07-30 20:13:44.103496
42	unclaimed_1753906423772_4aedo5x3t	4	0	2025-07-30 20:13:44.234236	2025-07-30 20:13:44.234236
43	unclaimed_1753906423772_4aedo5x3t	5	0	2025-07-30 20:13:44.29977	2025-07-30 20:13:44.29977
44	unclaimed_1753906423772_4aedo5x3t	7	0	2025-07-30 20:13:44.364526	2025-07-30 20:13:44.364526
45	unclaimed_1753976411439_e6jc6s5w5	1	0	2025-07-31 15:40:11.717926	2025-07-31 15:40:11.717926
46	unclaimed_1753976411439_e6jc6s5w5	7	0	2025-07-31 15:40:11.7931	2025-07-31 15:40:11.7931
47	unclaimed_1753976411439_e6jc6s5w5	2	0	2025-07-31 15:40:11.858419	2025-07-31 15:40:11.858419
49	unclaimed_1753976411439_e6jc6s5w5	4	0	2025-07-31 15:40:11.991492	2025-07-31 15:40:11.991492
50	unclaimed_1753976411439_e6jc6s5w5	5	0	2025-07-31 15:40:12.058969	2025-07-31 15:40:12.058969
51	unclaimed_1753976411439_e6jc6s5w5	8	0	2025-07-31 15:40:12.125377	2025-07-31 15:40:12.125377
52	unclaimed_1753976411439_e6jc6s5w5	9	0	2025-07-31 15:40:12.192054	2025-07-31 15:40:12.192054
53	unclaimed_1754047107989_jorwaa1d2	1	0	2025-08-01 11:18:28.254554	2025-08-01 11:18:28.254554
54	unclaimed_1754047107989_jorwaa1d2	7	0	2025-08-01 11:18:28.328948	2025-08-01 11:18:28.328948
55	unclaimed_1754047107989_jorwaa1d2	2	0	2025-08-01 11:18:28.393852	2025-08-01 11:18:28.393852
57	unclaimed_1754047107989_jorwaa1d2	4	0	2025-08-01 11:18:28.522722	2025-08-01 11:18:28.522722
58	unclaimed_1754047107989_jorwaa1d2	5	0	2025-08-01 11:18:28.587758	2025-08-01 11:18:28.587758
59	unclaimed_1754047107989_jorwaa1d2	8	0	2025-08-01 11:18:28.652727	2025-08-01 11:18:28.652727
60	unclaimed_1754047107989_jorwaa1d2	9	0	2025-08-01 11:18:28.717868	2025-08-01 11:18:28.717868
61	unclaimed_1754047107989_jorwaa1d2	10	0	2025-08-01 11:18:28.783036	2025-08-01 11:18:28.783036
62	unclaimed_1754047107989_jorwaa1d2	11	0	2025-08-01 11:18:28.848024	2025-08-01 11:18:28.848024
63	unclaimed_1754047107989_jorwaa1d2	12	0	2025-08-01 11:18:28.912742	2025-08-01 11:18:28.912742
64	unclaimed_1754048806293_3eppwfq0a	1	0	2025-08-01 11:46:46.533965	2025-08-01 11:46:46.533965
65	unclaimed_1754048806293_3eppwfq0a	7	0	2025-08-01 11:46:46.607194	2025-08-01 11:46:46.607194
66	unclaimed_1754048806293_3eppwfq0a	2	0	2025-08-01 11:46:46.67207	2025-08-01 11:46:46.67207
68	unclaimed_1754048806293_3eppwfq0a	4	0	2025-08-01 11:46:46.802057	2025-08-01 11:46:46.802057
69	unclaimed_1754048806293_3eppwfq0a	5	0	2025-08-01 11:46:46.865669	2025-08-01 11:46:46.865669
70	unclaimed_1754048806293_3eppwfq0a	8	0	2025-08-01 11:46:46.930544	2025-08-01 11:46:46.930544
71	unclaimed_1754048806293_3eppwfq0a	9	0	2025-08-01 11:46:46.995273	2025-08-01 11:46:46.995273
72	unclaimed_1754048806293_3eppwfq0a	10	0	2025-08-01 11:46:47.060427	2025-08-01 11:46:47.060427
73	unclaimed_1754048806293_3eppwfq0a	11	0	2025-08-01 11:46:47.125172	2025-08-01 11:46:47.125172
74	unclaimed_1754048806293_3eppwfq0a	12	0	2025-08-01 11:46:47.190013	2025-08-01 11:46:47.190013
75	unclaimed_1754048806293_3eppwfq0a	13	0	2025-08-01 11:46:47.25462	2025-08-01 11:46:47.25462
76	unclaimed_1754048806293_3eppwfq0a	14	0	2025-08-01 11:46:47.319259	2025-08-01 11:46:47.319259
83	1940567468453367808	8	0	2025-08-01 12:23:00.721173	2025-08-01 12:23:00.721173
84	1940567468453367808	9	0	2025-08-01 12:23:00.789289	2025-08-01 12:23:00.789289
85	1940567468453367808	10	0	2025-08-01 12:23:00.855321	2025-08-01 12:23:00.855321
86	1940567468453367808	11	0	2025-08-01 12:23:00.921422	2025-08-01 12:23:00.921422
87	1940567468453367808	12	0	2025-08-01 12:23:00.987923	2025-08-01 12:23:00.987923
88	1940567468453367808	13	0	2025-08-01 12:23:01.05393	2025-08-01 12:23:01.05393
89	1940567468453367808	14	0	2025-08-01 12:23:01.120354	2025-08-01 12:23:01.120354
118	1940567468453367808	15	0	2025-08-04 14:05:02.642286	2025-08-04 14:05:02.642286
119	1940567468453367808	18	0	2025-08-04 14:05:02.709091	2025-08-04 14:05:02.709091
120	1940567468453367808	17	0	2025-08-04 14:05:02.778219	2025-08-04 14:05:02.778219
121	1940567468453367808	3	0	2025-08-04 14:05:02.844431	2025-08-04 14:05:02.844431
138	unclaimed_1754325122482_cqyin11i0	1	0	2025-08-04 16:32:02.722304	2025-08-04 16:32:02.722304
139	unclaimed_1754325122482_cqyin11i0	7	0	2025-08-04 16:32:02.814663	2025-08-04 16:32:02.814663
140	unclaimed_1754325122482_cqyin11i0	2	0	2025-08-04 16:32:02.880634	2025-08-04 16:32:02.880634
141	unclaimed_1754325122482_cqyin11i0	4	0	2025-08-04 16:32:02.945592	2025-08-04 16:32:02.945592
142	unclaimed_1754325122482_cqyin11i0	5	0	2025-08-04 16:32:03.010593	2025-08-04 16:32:03.010593
143	unclaimed_1754325122482_cqyin11i0	8	0	2025-08-04 16:32:03.077159	2025-08-04 16:32:03.077159
144	unclaimed_1754325122482_cqyin11i0	9	0	2025-08-04 16:32:03.142364	2025-08-04 16:32:03.142364
145	unclaimed_1754325122482_cqyin11i0	10	0	2025-08-04 16:32:03.207812	2025-08-04 16:32:03.207812
146	unclaimed_1754325122482_cqyin11i0	11	0	2025-08-04 16:32:03.273052	2025-08-04 16:32:03.273052
147	unclaimed_1754325122482_cqyin11i0	12	0	2025-08-04 16:32:03.33868	2025-08-04 16:32:03.33868
148	unclaimed_1754325122482_cqyin11i0	13	0	2025-08-04 16:32:03.404064	2025-08-04 16:32:03.404064
149	unclaimed_1754325122482_cqyin11i0	14	0	2025-08-04 16:32:03.469498	2025-08-04 16:32:03.469498
150	unclaimed_1754325122482_cqyin11i0	15	0	2025-08-04 16:32:03.538671	2025-08-04 16:32:03.538671
151	unclaimed_1754325122482_cqyin11i0	18	0	2025-08-04 16:32:03.605321	2025-08-04 16:32:03.605321
152	unclaimed_1754325122482_cqyin11i0	17	0	2025-08-04 16:32:03.67074	2025-08-04 16:32:03.67074
153	unclaimed_1754325122482_cqyin11i0	3	0	2025-08-04 16:32:03.735859	2025-08-04 16:32:03.735859
154	unclaimed_1754334930623_nayncpsyk	1	0	2025-08-04 19:15:30.890991	2025-08-04 19:15:30.890991
155	unclaimed_1754334930623_nayncpsyk	7	0	2025-08-04 19:15:30.966672	2025-08-04 19:15:30.966672
156	unclaimed_1754334930623_nayncpsyk	2	0	2025-08-04 19:15:31.031578	2025-08-04 19:15:31.031578
157	unclaimed_1754334930623_nayncpsyk	4	0	2025-08-04 19:15:31.096736	2025-08-04 19:15:31.096736
158	unclaimed_1754334930623_nayncpsyk	5	0	2025-08-04 19:15:31.161631	2025-08-04 19:15:31.161631
159	unclaimed_1754334930623_nayncpsyk	8	0	2025-08-04 19:15:31.226496	2025-08-04 19:15:31.226496
160	unclaimed_1754334930623_nayncpsyk	9	0	2025-08-04 19:15:31.291326	2025-08-04 19:15:31.291326
161	unclaimed_1754334930623_nayncpsyk	10	0	2025-08-04 19:15:31.356273	2025-08-04 19:15:31.356273
162	unclaimed_1754334930623_nayncpsyk	11	0	2025-08-04 19:15:31.421259	2025-08-04 19:15:31.421259
163	unclaimed_1754334930623_nayncpsyk	12	0	2025-08-04 19:15:31.485033	2025-08-04 19:15:31.485033
164	unclaimed_1754334930623_nayncpsyk	13	0	2025-08-04 19:15:31.548974	2025-08-04 19:15:31.548974
165	unclaimed_1754334930623_nayncpsyk	14	0	2025-08-04 19:15:31.613787	2025-08-04 19:15:31.613787
166	unclaimed_1754334930623_nayncpsyk	15	0	2025-08-04 19:15:31.678672	2025-08-04 19:15:31.678672
167	unclaimed_1754334930623_nayncpsyk	18	0	2025-08-04 19:15:31.743463	2025-08-04 19:15:31.743463
168	unclaimed_1754334930623_nayncpsyk	17	0	2025-08-04 19:15:31.808281	2025-08-04 19:15:31.808281
169	unclaimed_1754334930623_nayncpsyk	3	0	2025-08-04 19:15:31.873311	2025-08-04 19:15:31.873311
218	unclaimed_1754350236092_z31grdc8w	1	0	2025-08-04 23:30:36.335905	2025-08-04 23:30:36.335905
219	unclaimed_1754350236092_z31grdc8w	7	0	2025-08-04 23:30:36.413213	2025-08-04 23:30:36.413213
220	unclaimed_1754350236092_z31grdc8w	2	0	2025-08-04 23:30:36.478549	2025-08-04 23:30:36.478549
221	unclaimed_1754350236092_z31grdc8w	4	0	2025-08-04 23:30:36.543579	2025-08-04 23:30:36.543579
222	unclaimed_1754350236092_z31grdc8w	5	0	2025-08-04 23:30:36.608837	2025-08-04 23:30:36.608837
223	unclaimed_1754350236092_z31grdc8w	8	0	2025-08-04 23:30:36.676739	2025-08-04 23:30:36.676739
224	unclaimed_1754350236092_z31grdc8w	9	0	2025-08-04 23:30:36.741613	2025-08-04 23:30:36.741613
225	unclaimed_1754350236092_z31grdc8w	10	0	2025-08-04 23:30:36.806408	2025-08-04 23:30:36.806408
226	unclaimed_1754350236092_z31grdc8w	11	0	2025-08-04 23:30:36.871438	2025-08-04 23:30:36.871438
227	unclaimed_1754350236092_z31grdc8w	12	0	2025-08-04 23:30:36.936279	2025-08-04 23:30:36.936279
228	unclaimed_1754350236092_z31grdc8w	13	0	2025-08-04 23:30:37.00144	2025-08-04 23:30:37.00144
229	unclaimed_1754350236092_z31grdc8w	14	0	2025-08-04 23:30:37.066701	2025-08-04 23:30:37.066701
230	unclaimed_1754350236092_z31grdc8w	15	0	2025-08-04 23:30:37.134397	2025-08-04 23:30:37.134397
231	unclaimed_1754350236092_z31grdc8w	18	0	2025-08-04 23:30:37.19934	2025-08-04 23:30:37.19934
232	unclaimed_1754350236092_z31grdc8w	17	0	2025-08-04 23:30:37.264409	2025-08-04 23:30:37.264409
233	unclaimed_1754350236092_z31grdc8w	3	0	2025-08-04 23:30:37.329295	2025-08-04 23:30:37.329295
234	unclaimed_1754443622811_h0dewav4n	1	0	2025-08-06 01:27:03.076849	2025-08-06 01:27:03.076849
235	unclaimed_1754443622811_h0dewav4n	7	0	2025-08-06 01:27:03.15112	2025-08-06 01:27:03.15112
236	unclaimed_1754443622811_h0dewav4n	2	0	2025-08-06 01:27:03.214829	2025-08-06 01:27:03.214829
237	unclaimed_1754443622811_h0dewav4n	4	0	2025-08-06 01:27:03.27975	2025-08-06 01:27:03.27975
238	unclaimed_1754443622811_h0dewav4n	5	0	2025-08-06 01:27:03.343805	2025-08-06 01:27:03.343805
239	unclaimed_1754443622811_h0dewav4n	8	0	2025-08-06 01:27:03.408453	2025-08-06 01:27:03.408453
240	unclaimed_1754443622811_h0dewav4n	9	0	2025-08-06 01:27:03.473444	2025-08-06 01:27:03.473444
241	unclaimed_1754443622811_h0dewav4n	10	0	2025-08-06 01:27:03.538318	2025-08-06 01:27:03.538318
242	unclaimed_1754443622811_h0dewav4n	11	0	2025-08-06 01:27:03.603209	2025-08-06 01:27:03.603209
243	unclaimed_1754443622811_h0dewav4n	12	0	2025-08-06 01:27:03.666823	2025-08-06 01:27:03.666823
244	unclaimed_1754443622811_h0dewav4n	13	0	2025-08-06 01:27:03.731419	2025-08-06 01:27:03.731419
245	unclaimed_1754443622811_h0dewav4n	14	0	2025-08-06 01:27:03.796025	2025-08-06 01:27:03.796025
246	unclaimed_1754443622811_h0dewav4n	15	0	2025-08-06 01:27:03.86071	2025-08-06 01:27:03.86071
247	unclaimed_1754443622811_h0dewav4n	18	0	2025-08-06 01:27:03.925311	2025-08-06 01:27:03.925311
248	unclaimed_1754443622811_h0dewav4n	17	0	2025-08-06 01:27:03.989911	2025-08-06 01:27:03.989911
249	unclaimed_1754443622811_h0dewav4n	3	0	2025-08-06 01:27:04.054452	2025-08-06 01:27:04.054452
250	unclaimed_1754931413976_tdkck1zod	1	0	2025-08-11 16:56:54.230497	2025-08-11 16:56:54.230497
251	unclaimed_1754931413976_tdkck1zod	7	0	2025-08-11 16:56:54.309338	2025-08-11 16:56:54.309338
252	unclaimed_1754931413976_tdkck1zod	2	0	2025-08-11 16:56:54.376958	2025-08-11 16:56:54.376958
253	unclaimed_1754931413976_tdkck1zod	4	0	2025-08-11 16:56:54.444755	2025-08-11 16:56:54.444755
254	unclaimed_1754931413976_tdkck1zod	5	0	2025-08-11 16:56:54.519076	2025-08-11 16:56:54.519076
255	unclaimed_1754931413976_tdkck1zod	8	0	2025-08-11 16:56:54.586422	2025-08-11 16:56:54.586422
256	unclaimed_1754931413976_tdkck1zod	9	0	2025-08-11 16:56:54.653879	2025-08-11 16:56:54.653879
257	unclaimed_1754931413976_tdkck1zod	10	0	2025-08-11 16:56:54.721275	2025-08-11 16:56:54.721275
258	unclaimed_1754931413976_tdkck1zod	11	0	2025-08-11 16:56:54.789274	2025-08-11 16:56:54.789274
259	unclaimed_1754931413976_tdkck1zod	12	0	2025-08-11 16:56:54.857146	2025-08-11 16:56:54.857146
260	unclaimed_1754931413976_tdkck1zod	13	0	2025-08-11 16:56:54.924596	2025-08-11 16:56:54.924596
261	unclaimed_1754931413976_tdkck1zod	14	0	2025-08-11 16:56:54.991696	2025-08-11 16:56:54.991696
262	unclaimed_1754931413976_tdkck1zod	15	0	2025-08-11 16:56:55.062857	2025-08-11 16:56:55.062857
263	unclaimed_1754931413976_tdkck1zod	18	0	2025-08-11 16:56:55.130486	2025-08-11 16:56:55.130486
264	unclaimed_1754931413976_tdkck1zod	17	0	2025-08-11 16:56:55.200188	2025-08-11 16:56:55.200188
265	unclaimed_1754931413976_tdkck1zod	3	0	2025-08-11 16:56:55.269639	2025-08-11 16:56:55.269639
266	unclaimed_1755544327395_kpafyg4ki	1	0	2025-08-18 19:12:07.655256	2025-08-18 19:12:07.655256
267	unclaimed_1755544327395_kpafyg4ki	7	0	2025-08-18 19:12:07.752206	2025-08-18 19:12:07.752206
268	unclaimed_1755544327395_kpafyg4ki	2	0	2025-08-18 19:12:07.821807	2025-08-18 19:12:07.821807
269	unclaimed_1755544327395_kpafyg4ki	4	0	2025-08-18 19:12:07.891048	2025-08-18 19:12:07.891048
270	unclaimed_1755544327395_kpafyg4ki	5	0	2025-08-18 19:12:07.960487	2025-08-18 19:12:07.960487
271	unclaimed_1755544327395_kpafyg4ki	8	0	2025-08-18 19:12:08.029731	2025-08-18 19:12:08.029731
272	unclaimed_1755544327395_kpafyg4ki	9	0	2025-08-18 19:12:08.099098	2025-08-18 19:12:08.099098
273	unclaimed_1755544327395_kpafyg4ki	10	0	2025-08-18 19:12:08.167143	2025-08-18 19:12:08.167143
274	unclaimed_1755544327395_kpafyg4ki	11	0	2025-08-18 19:12:08.238136	2025-08-18 19:12:08.238136
275	unclaimed_1755544327395_kpafyg4ki	12	0	2025-08-18 19:12:08.307376	2025-08-18 19:12:08.307376
276	unclaimed_1755544327395_kpafyg4ki	13	0	2025-08-18 19:12:08.376315	2025-08-18 19:12:08.376315
277	unclaimed_1755544327395_kpafyg4ki	14	0	2025-08-18 19:12:08.44558	2025-08-18 19:12:08.44558
278	unclaimed_1755544327395_kpafyg4ki	15	0	2025-08-18 19:12:08.514654	2025-08-18 19:12:08.514654
279	unclaimed_1755544327395_kpafyg4ki	18	0	2025-08-18 19:12:08.583828	2025-08-18 19:12:08.583828
280	unclaimed_1755544327395_kpafyg4ki	17	0	2025-08-18 19:12:08.653779	2025-08-18 19:12:08.653779
281	unclaimed_1755544327395_kpafyg4ki	3	0	2025-08-18 19:12:08.723059	2025-08-18 19:12:08.723059
282	unclaimed_1755544824214_l8o9ouoxv	1	0	2025-08-18 19:20:24.476338	2025-08-18 19:20:24.476338
283	unclaimed_1755544824214_l8o9ouoxv	7	0	2025-08-18 19:20:24.557409	2025-08-18 19:20:24.557409
284	unclaimed_1755544824214_l8o9ouoxv	2	0	2025-08-18 19:20:24.626846	2025-08-18 19:20:24.626846
285	unclaimed_1755544824214_l8o9ouoxv	4	0	2025-08-18 19:20:24.696299	2025-08-18 19:20:24.696299
286	unclaimed_1755544824214_l8o9ouoxv	5	0	2025-08-18 19:20:24.76698	2025-08-18 19:20:24.76698
287	unclaimed_1755544824214_l8o9ouoxv	8	0	2025-08-18 19:20:24.836439	2025-08-18 19:20:24.836439
288	unclaimed_1755544824214_l8o9ouoxv	9	0	2025-08-18 19:20:24.906103	2025-08-18 19:20:24.906103
289	unclaimed_1755544824214_l8o9ouoxv	10	0	2025-08-18 19:20:24.975504	2025-08-18 19:20:24.975504
290	unclaimed_1755544824214_l8o9ouoxv	11	0	2025-08-18 19:20:25.044917	2025-08-18 19:20:25.044917
291	unclaimed_1755544824214_l8o9ouoxv	12	0	2025-08-18 19:20:25.114926	2025-08-18 19:20:25.114926
292	unclaimed_1755544824214_l8o9ouoxv	13	0	2025-08-18 19:20:25.184572	2025-08-18 19:20:25.184572
293	unclaimed_1755544824214_l8o9ouoxv	14	0	2025-08-18 19:20:25.253867	2025-08-18 19:20:25.253867
294	unclaimed_1755544824214_l8o9ouoxv	15	0	2025-08-18 19:20:25.323033	2025-08-18 19:20:25.323033
295	unclaimed_1755544824214_l8o9ouoxv	18	0	2025-08-18 19:20:25.392645	2025-08-18 19:20:25.392645
296	unclaimed_1755544824214_l8o9ouoxv	17	0	2025-08-18 19:20:25.462271	2025-08-18 19:20:25.462271
297	unclaimed_1755544824214_l8o9ouoxv	3	0	2025-08-18 19:20:25.531588	2025-08-18 19:20:25.531588
298	unclaimed_1756898901215_md90l482r	1	0	2025-09-03 11:28:21.474283	2025-09-03 11:28:21.474283
299	unclaimed_1756898901215_md90l482r	7	0	2025-09-03 11:28:21.548867	2025-09-03 11:28:21.548867
300	unclaimed_1756898901215_md90l482r	2	0	2025-09-03 11:28:21.615173	2025-09-03 11:28:21.615173
301	unclaimed_1756898901215_md90l482r	4	0	2025-09-03 11:28:21.681258	2025-09-03 11:28:21.681258
302	unclaimed_1756898901215_md90l482r	5	0	2025-09-03 11:28:21.747045	2025-09-03 11:28:21.747045
303	unclaimed_1756898901215_md90l482r	8	0	2025-09-03 11:28:21.813042	2025-09-03 11:28:21.813042
304	unclaimed_1756898901215_md90l482r	9	0	2025-09-03 11:28:21.879215	2025-09-03 11:28:21.879215
305	unclaimed_1756898901215_md90l482r	10	0	2025-09-03 11:28:21.945541	2025-09-03 11:28:21.945541
306	unclaimed_1756898901215_md90l482r	11	0	2025-09-03 11:28:22.011469	2025-09-03 11:28:22.011469
307	unclaimed_1756898901215_md90l482r	12	0	2025-09-03 11:28:22.07731	2025-09-03 11:28:22.07731
308	unclaimed_1756898901215_md90l482r	13	0	2025-09-03 11:28:22.143488	2025-09-03 11:28:22.143488
309	unclaimed_1756898901215_md90l482r	14	0	2025-09-03 11:28:22.209096	2025-09-03 11:28:22.209096
310	unclaimed_1756898901215_md90l482r	15	0	2025-09-03 11:28:22.274512	2025-09-03 11:28:22.274512
311	unclaimed_1756898901215_md90l482r	18	0	2025-09-03 11:28:22.339651	2025-09-03 11:28:22.339651
312	unclaimed_1756898901215_md90l482r	17	0	2025-09-03 11:28:22.405781	2025-09-03 11:28:22.405781
313	unclaimed_1756898901215_md90l482r	3	0	2025-09-03 11:28:22.471565	2025-09-03 11:28:22.471565
314	unclaimed_1757370896168_2mgv3qos2	1	0	2025-09-08 22:34:56.424971	2025-09-08 22:34:56.424971
315	unclaimed_1757370896168_2mgv3qos2	7	0	2025-09-08 22:34:56.502404	2025-09-08 22:34:56.502404
316	unclaimed_1757370896168_2mgv3qos2	2	0	2025-09-08 22:34:56.568537	2025-09-08 22:34:56.568537
317	unclaimed_1757370896168_2mgv3qos2	4	0	2025-09-08 22:34:56.635027	2025-09-08 22:34:56.635027
318	unclaimed_1757370896168_2mgv3qos2	5	0	2025-09-08 22:34:56.701167	2025-09-08 22:34:56.701167
319	unclaimed_1757370896168_2mgv3qos2	8	0	2025-09-08 22:34:56.767282	2025-09-08 22:34:56.767282
320	unclaimed_1757370896168_2mgv3qos2	9	0	2025-09-08 22:34:56.832601	2025-09-08 22:34:56.832601
321	unclaimed_1757370896168_2mgv3qos2	10	0	2025-09-08 22:34:56.898937	2025-09-08 22:34:56.898937
322	unclaimed_1757370896168_2mgv3qos2	11	0	2025-09-08 22:34:56.96569	2025-09-08 22:34:56.96569
323	unclaimed_1757370896168_2mgv3qos2	12	0	2025-09-08 22:34:57.031977	2025-09-08 22:34:57.031977
324	unclaimed_1757370896168_2mgv3qos2	13	0	2025-09-08 22:34:57.097966	2025-09-08 22:34:57.097966
325	unclaimed_1757370896168_2mgv3qos2	14	0	2025-09-08 22:34:57.164104	2025-09-08 22:34:57.164104
326	unclaimed_1757370896168_2mgv3qos2	15	0	2025-09-08 22:34:57.230156	2025-09-08 22:34:57.230156
327	unclaimed_1757370896168_2mgv3qos2	18	0	2025-09-08 22:34:57.295931	2025-09-08 22:34:57.295931
328	unclaimed_1757370896168_2mgv3qos2	17	0	2025-09-08 22:34:57.362162	2025-09-08 22:34:57.362162
329	unclaimed_1757370896168_2mgv3qos2	3	0	2025-09-08 22:34:57.428245	2025-09-08 22:34:57.428245
330	unclaimed_1761057399602_oj87lsf6d	1	0	2025-10-21 14:36:39.863695	2025-10-21 14:36:39.863695
331	unclaimed_1761057399602_oj87lsf6d	7	0	2025-10-21 14:36:39.940968	2025-10-21 14:36:39.940968
332	unclaimed_1761057399602_oj87lsf6d	2	0	2025-10-21 14:36:40.005483	2025-10-21 14:36:40.005483
333	unclaimed_1761057399602_oj87lsf6d	4	0	2025-10-21 14:36:40.07008	2025-10-21 14:36:40.07008
334	unclaimed_1761057399602_oj87lsf6d	5	0	2025-10-21 14:36:40.134868	2025-10-21 14:36:40.134868
335	unclaimed_1761057399602_oj87lsf6d	8	0	2025-10-21 14:36:40.200985	2025-10-21 14:36:40.200985
336	unclaimed_1761057399602_oj87lsf6d	9	0	2025-10-21 14:36:40.265671	2025-10-21 14:36:40.265671
337	unclaimed_1761057399602_oj87lsf6d	10	0	2025-10-21 14:36:40.330646	2025-10-21 14:36:40.330646
338	unclaimed_1761057399602_oj87lsf6d	11	0	2025-10-21 14:36:40.394993	2025-10-21 14:36:40.394993
339	unclaimed_1761057399602_oj87lsf6d	12	0	2025-10-21 14:36:40.460534	2025-10-21 14:36:40.460534
340	unclaimed_1761057399602_oj87lsf6d	13	0	2025-10-21 14:36:40.524084	2025-10-21 14:36:40.524084
341	unclaimed_1761057399602_oj87lsf6d	14	0	2025-10-21 14:36:40.588898	2025-10-21 14:36:40.588898
342	unclaimed_1761057399602_oj87lsf6d	15	0	2025-10-21 14:36:40.653504	2025-10-21 14:36:40.653504
343	unclaimed_1761057399602_oj87lsf6d	18	0	2025-10-21 14:36:40.718132	2025-10-21 14:36:40.718132
344	unclaimed_1761057399602_oj87lsf6d	17	0	2025-10-21 14:36:40.782714	2025-10-21 14:36:40.782714
345	unclaimed_1761057399602_oj87lsf6d	3	0	2025-10-21 14:36:40.846128	2025-10-21 14:36:40.846128
346	unclaimed_1761077625620_h9olo856d	1	0	2025-10-21 20:13:45.864796	2025-10-21 20:13:45.864796
347	unclaimed_1761077625620_h9olo856d	7	0	2025-10-21 20:13:45.939442	2025-10-21 20:13:45.939442
348	unclaimed_1761077625620_h9olo856d	2	0	2025-10-21 20:13:46.007972	2025-10-21 20:13:46.007972
349	unclaimed_1761077625620_h9olo856d	4	0	2025-10-21 20:13:46.076144	2025-10-21 20:13:46.076144
350	unclaimed_1761077625620_h9olo856d	5	0	2025-10-21 20:13:46.142079	2025-10-21 20:13:46.142079
351	unclaimed_1761077625620_h9olo856d	8	0	2025-10-21 20:13:46.208734	2025-10-21 20:13:46.208734
352	unclaimed_1761077625620_h9olo856d	9	0	2025-10-21 20:13:46.27589	2025-10-21 20:13:46.27589
353	unclaimed_1761077625620_h9olo856d	10	0	2025-10-21 20:13:46.341922	2025-10-21 20:13:46.341922
354	unclaimed_1761077625620_h9olo856d	11	0	2025-10-21 20:13:46.407946	2025-10-21 20:13:46.407946
355	unclaimed_1761077625620_h9olo856d	12	0	2025-10-21 20:13:46.474936	2025-10-21 20:13:46.474936
356	unclaimed_1761077625620_h9olo856d	13	0	2025-10-21 20:13:46.541075	2025-10-21 20:13:46.541075
357	unclaimed_1761077625620_h9olo856d	14	0	2025-10-21 20:13:46.607288	2025-10-21 20:13:46.607288
358	unclaimed_1761077625620_h9olo856d	15	0	2025-10-21 20:13:46.673318	2025-10-21 20:13:46.673318
359	unclaimed_1761077625620_h9olo856d	18	0	2025-10-21 20:13:46.740675	2025-10-21 20:13:46.740675
360	unclaimed_1761077625620_h9olo856d	17	0	2025-10-21 20:13:46.806442	2025-10-21 20:13:46.806442
361	unclaimed_1761077625620_h9olo856d	3	0	2025-10-21 20:13:46.872371	2025-10-21 20:13:46.872371
362	unclaimed_1761590984358_cylskgzq6	1	0	2025-10-27 18:49:44.662793	2025-10-27 18:49:44.662793
363	unclaimed_1761590984358_cylskgzq6	7	0	2025-10-27 18:49:44.738922	2025-10-27 18:49:44.738922
364	unclaimed_1761590984358_cylskgzq6	2	0	2025-10-27 18:49:44.806248	2025-10-27 18:49:44.806248
365	unclaimed_1761590984358_cylskgzq6	4	0	2025-10-27 18:49:44.871782	2025-10-27 18:49:44.871782
366	unclaimed_1761590984358_cylskgzq6	5	0	2025-10-27 18:49:44.937377	2025-10-27 18:49:44.937377
367	unclaimed_1761590984358_cylskgzq6	8	0	2025-10-27 18:49:45.00839	2025-10-27 18:49:45.00839
368	unclaimed_1761590984358_cylskgzq6	9	0	2025-10-27 18:49:45.07521	2025-10-27 18:49:45.07521
369	unclaimed_1761590984358_cylskgzq6	10	0	2025-10-27 18:49:45.140721	2025-10-27 18:49:45.140721
370	unclaimed_1761590984358_cylskgzq6	11	0	2025-10-27 18:49:45.206414	2025-10-27 18:49:45.206414
371	unclaimed_1761590984358_cylskgzq6	12	0	2025-10-27 18:49:45.272014	2025-10-27 18:49:45.272014
372	unclaimed_1761590984358_cylskgzq6	13	0	2025-10-27 18:49:45.337644	2025-10-27 18:49:45.337644
373	unclaimed_1761590984358_cylskgzq6	14	0	2025-10-27 18:49:45.403755	2025-10-27 18:49:45.403755
374	unclaimed_1761590984358_cylskgzq6	15	0	2025-10-27 18:49:45.469226	2025-10-27 18:49:45.469226
375	unclaimed_1761590984358_cylskgzq6	18	0	2025-10-27 18:49:45.53565	2025-10-27 18:49:45.53565
376	unclaimed_1761590984358_cylskgzq6	17	0	2025-10-27 18:49:45.601245	2025-10-27 18:49:45.601245
377	unclaimed_1761590984358_cylskgzq6	3	0	2025-10-27 18:49:45.666455	2025-10-27 18:49:45.666455
378	unclaimed_1761598725591_bwyuqfwfn	1	0	2025-10-27 20:58:45.89945	2025-10-27 20:58:45.89945
379	unclaimed_1761598725591_bwyuqfwfn	7	0	2025-10-27 20:58:45.979036	2025-10-27 20:58:45.979036
380	unclaimed_1761598725591_bwyuqfwfn	2	0	2025-10-27 20:58:46.04478	2025-10-27 20:58:46.04478
381	unclaimed_1761598725591_bwyuqfwfn	4	0	2025-10-27 20:58:46.111217	2025-10-27 20:58:46.111217
382	unclaimed_1761598725591_bwyuqfwfn	5	0	2025-10-27 20:58:46.177302	2025-10-27 20:58:46.177302
383	unclaimed_1761598725591_bwyuqfwfn	8	0	2025-10-27 20:58:46.244194	2025-10-27 20:58:46.244194
384	unclaimed_1761598725591_bwyuqfwfn	9	0	2025-10-27 20:58:46.310028	2025-10-27 20:58:46.310028
385	unclaimed_1761598725591_bwyuqfwfn	10	0	2025-10-27 20:58:46.376321	2025-10-27 20:58:46.376321
386	unclaimed_1761598725591_bwyuqfwfn	11	0	2025-10-27 20:58:46.442004	2025-10-27 20:58:46.442004
387	unclaimed_1761598725591_bwyuqfwfn	12	0	2025-10-27 20:58:46.508013	2025-10-27 20:58:46.508013
388	unclaimed_1761598725591_bwyuqfwfn	13	0	2025-10-27 20:58:46.574419	2025-10-27 20:58:46.574419
389	unclaimed_1761598725591_bwyuqfwfn	14	0	2025-10-27 20:58:46.640148	2025-10-27 20:58:46.640148
390	unclaimed_1761598725591_bwyuqfwfn	15	0	2025-10-27 20:58:46.706568	2025-10-27 20:58:46.706568
391	unclaimed_1761598725591_bwyuqfwfn	18	0	2025-10-27 20:58:46.772608	2025-10-27 20:58:46.772608
392	unclaimed_1761598725591_bwyuqfwfn	17	0	2025-10-27 20:58:46.837303	2025-10-27 20:58:46.837303
393	unclaimed_1761598725591_bwyuqfwfn	3	0	2025-10-27 20:58:46.905577	2025-10-27 20:58:46.905577
394	unclaimed_1761996019871_w10xye861	1	0	2025-11-01 11:20:20.320341	2025-11-01 11:20:20.320341
395	unclaimed_1761996019871_w10xye861	7	0	2025-11-01 11:20:20.405716	2025-11-01 11:20:20.405716
396	unclaimed_1761996019871_w10xye861	2	0	2025-11-01 11:20:20.475529	2025-11-01 11:20:20.475529
397	unclaimed_1761996019871_w10xye861	4	0	2025-11-01 11:20:20.546697	2025-11-01 11:20:20.546697
398	unclaimed_1761996019871_w10xye861	5	0	2025-11-01 11:20:20.618798	2025-11-01 11:20:20.618798
399	unclaimed_1761996019871_w10xye861	8	0	2025-11-01 11:20:20.689264	2025-11-01 11:20:20.689264
400	unclaimed_1761996019871_w10xye861	9	0	2025-11-01 11:20:20.759905	2025-11-01 11:20:20.759905
401	unclaimed_1761996019871_w10xye861	10	0	2025-11-01 11:20:20.830358	2025-11-01 11:20:20.830358
402	unclaimed_1761996019871_w10xye861	11	0	2025-11-01 11:20:20.901417	2025-11-01 11:20:20.901417
403	unclaimed_1761996019871_w10xye861	12	0	2025-11-01 11:20:20.972096	2025-11-01 11:20:20.972096
404	unclaimed_1761996019871_w10xye861	13	0	2025-11-01 11:20:21.043677	2025-11-01 11:20:21.043677
405	unclaimed_1761996019871_w10xye861	14	0	2025-11-01 11:20:21.113554	2025-11-01 11:20:21.113554
406	unclaimed_1761996019871_w10xye861	15	0	2025-11-01 11:20:21.184143	2025-11-01 11:20:21.184143
407	unclaimed_1761996019871_w10xye861	18	0	2025-11-01 11:20:21.254107	2025-11-01 11:20:21.254107
408	unclaimed_1761996019871_w10xye861	17	0	2025-11-01 11:20:21.325076	2025-11-01 11:20:21.325076
409	unclaimed_1761996019871_w10xye861	3	0	2025-11-01 11:20:21.397889	2025-11-01 11:20:21.397889
410	unclaimed_1762003515587_tgxl9s7dk	1	0	2025-11-01 13:25:15.964507	2025-11-01 13:25:15.964507
411	unclaimed_1762003515587_tgxl9s7dk	7	0	2025-11-01 13:25:16.047729	2025-11-01 13:25:16.047729
412	unclaimed_1762003515587_tgxl9s7dk	2	0	2025-11-01 13:25:16.116546	2025-11-01 13:25:16.116546
413	unclaimed_1762003515587_tgxl9s7dk	4	0	2025-11-01 13:25:16.186001	2025-11-01 13:25:16.186001
414	unclaimed_1762003515587_tgxl9s7dk	5	0	2025-11-01 13:25:16.25597	2025-11-01 13:25:16.25597
415	unclaimed_1762003515587_tgxl9s7dk	8	0	2025-11-01 13:25:16.325893	2025-11-01 13:25:16.325893
416	unclaimed_1762003515587_tgxl9s7dk	9	0	2025-11-01 13:25:16.395728	2025-11-01 13:25:16.395728
417	unclaimed_1762003515587_tgxl9s7dk	10	0	2025-11-01 13:25:16.466802	2025-11-01 13:25:16.466802
418	unclaimed_1762003515587_tgxl9s7dk	11	0	2025-11-01 13:25:16.537802	2025-11-01 13:25:16.537802
419	unclaimed_1762003515587_tgxl9s7dk	12	0	2025-11-01 13:25:16.607937	2025-11-01 13:25:16.607937
420	unclaimed_1762003515587_tgxl9s7dk	13	0	2025-11-01 13:25:16.676647	2025-11-01 13:25:16.676647
421	unclaimed_1762003515587_tgxl9s7dk	14	0	2025-11-01 13:25:16.745428	2025-11-01 13:25:16.745428
422	unclaimed_1762003515587_tgxl9s7dk	15	0	2025-11-01 13:25:16.814572	2025-11-01 13:25:16.814572
423	unclaimed_1762003515587_tgxl9s7dk	18	0	2025-11-01 13:25:16.883304	2025-11-01 13:25:16.883304
424	unclaimed_1762003515587_tgxl9s7dk	17	0	2025-11-01 13:25:16.952245	2025-11-01 13:25:16.952245
425	unclaimed_1762003515587_tgxl9s7dk	3	0	2025-11-01 13:25:17.025416	2025-11-01 13:25:17.025416
426	unclaimed_1762503476265_91xpb7k0o	1	0	2025-11-07 08:17:56.516588	2025-11-07 08:17:56.516588
427	unclaimed_1762503476265_91xpb7k0o	7	0	2025-11-07 08:17:56.594583	2025-11-07 08:17:56.594583
428	unclaimed_1762503476265_91xpb7k0o	2	0	2025-11-07 08:17:56.660682	2025-11-07 08:17:56.660682
429	unclaimed_1762503476265_91xpb7k0o	4	0	2025-11-07 08:17:56.726651	2025-11-07 08:17:56.726651
430	unclaimed_1762503476265_91xpb7k0o	5	0	2025-11-07 08:17:56.792617	2025-11-07 08:17:56.792617
431	unclaimed_1762503476265_91xpb7k0o	8	0	2025-11-07 08:17:56.858554	2025-11-07 08:17:56.858554
432	unclaimed_1762503476265_91xpb7k0o	9	0	2025-11-07 08:17:56.98539	2025-11-07 08:17:56.98539
433	unclaimed_1762503476265_91xpb7k0o	10	0	2025-11-07 08:17:57.051184	2025-11-07 08:17:57.051184
434	unclaimed_1762503476265_91xpb7k0o	11	0	2025-11-07 08:17:57.116842	2025-11-07 08:17:57.116842
435	unclaimed_1762503476265_91xpb7k0o	12	0	2025-11-07 08:17:57.182641	2025-11-07 08:17:57.182641
436	unclaimed_1762503476265_91xpb7k0o	13	0	2025-11-07 08:17:57.248605	2025-11-07 08:17:57.248605
437	unclaimed_1762503476265_91xpb7k0o	14	0	2025-11-07 08:17:57.314817	2025-11-07 08:17:57.314817
438	unclaimed_1762503476265_91xpb7k0o	15	0	2025-11-07 08:17:57.380726	2025-11-07 08:17:57.380726
439	unclaimed_1762503476265_91xpb7k0o	18	0	2025-11-07 08:17:57.446774	2025-11-07 08:17:57.446774
440	unclaimed_1762503476265_91xpb7k0o	17	0	2025-11-07 08:17:57.512848	2025-11-07 08:17:57.512848
441	unclaimed_1762503476265_91xpb7k0o	3	0	2025-11-07 08:17:57.629262	2025-11-07 08:17:57.629262
\.


--
-- Data for Name: user_quest_progress; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_quest_progress (id, user_id, quest_id, status, is_winner, reward_claimed, started_at, completed_at, created_at) FROM stdin;
1	1940567468453367808	1	completed	f	f	2025-08-06 14:44:03.926629	2025-08-08 15:01:52.467	2025-08-06 21:19:31.615367
2	1940567468453367808	6	completed	f	f	2025-08-10 22:09:58.821	2025-08-10 23:43:38.140634	2025-08-10 22:09:58.857509
3	1953113551893073922	6	completed	f	t	2025-08-10 22:35:06.198	2025-08-11 18:53:57.280386	2025-08-10 22:35:06.234127
4	1943623053071765504	6	completed	f	t	2025-08-11 18:28:33.795	2025-08-11 19:18:18.898591	2025-08-11 18:28:33.831322
5	1955002803245682690	6	completed	f	t	2025-08-11 20:41:44.717	2025-08-11 21:10:22.757	2025-08-11 20:41:44.753071
6	1955633228036886528	6	completed	f	f	2025-08-14 12:31:33.258	2025-08-15 12:39:01.379	2025-08-14 12:31:33.294571
7	unclaimed_1753906423772_4aedo5x3t	6	completed	f	t	2025-09-03 08:30:47.177	2025-09-03 08:38:49.74	2025-09-03 08:30:47.215359
\.


--
-- Data for Name: user_quest_task_progress; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_quest_task_progress (id, user_id, quest_id, task_id, current_count, target_count, is_completed, completed_at, updated_at) FROM stdin;
5	1953113551893073922	6	17	1	1	t	2025-08-11 14:22:18.263362	2025-08-11 14:22:18.263362
6	1953113551893073922	6	18	2	1	t	2025-08-11 14:22:18.263362	2025-08-11 14:22:18.263362
7	1953113551893073922	6	19	1	1	t	2025-08-11 00:50:06.196742	2025-08-11 15:22:53.687719
1	1940567468453367808	6	17	1	1	t	\N	2025-08-11 17:24:06.132603
2	1940567468453367808	6	18	1	1	t	\N	2025-08-11 17:24:06.132603
3	1940567468453367808	6	19	1	1	t	\N	2025-08-11 17:24:06.132603
4	1940567468453367808	6	20	1	1	t	\N	2025-08-11 17:24:06.132603
8	1953113551893073922	6	20	1	1	t	\N	2025-08-11 18:07:37.957527
9	1943623053071765504	6	17	1	1	t	2025-08-11 18:34:48.772	2025-08-11 18:34:48.772
10	1943623053071765504	6	18	2	1	t	2025-08-11 19:15:06.084741	2025-08-11 19:15:06.084741
11	1943623053071765504	6	19	1	1	t	2025-08-11 19:15:07.564366	2025-08-11 19:15:07.564366
12	1943623053071765504	6	20	2	1	t	2025-08-11 19:15:08.790399	2025-08-11 19:15:08.790399
15	1955002803245682690	6	19	1	1	t	2025-08-11 21:04:18.272	2025-08-11 21:04:18.272
14	1955002803245682690	6	18	1	1	t	2025-08-11 21:04:21.293	2025-08-11 21:04:21.293
16	1955002803245682690	6	20	1	1	t	2025-08-11 21:08:01.088	2025-08-11 21:08:01.088
13	1955002803245682690	6	17	1	1	t	2025-08-11 21:10:21.83	2025-08-11 21:10:21.83
18	1955633228036886528	6	18	0	1	f	\N	2025-08-14 12:31:33.533522
19	1955633228036886528	6	19	0	1	f	\N	2025-08-14 12:31:33.600686
20	1955633228036886528	6	20	0	1	f	\N	2025-08-14 12:31:33.668247
17	1955633228036886528	6	17	1	1	t	2025-08-14 14:23:53.538	2025-08-14 14:23:53.538
21	unclaimed_1753906423772_4aedo5x3t	6	17	1	1	t	2025-09-03 08:32:38.781	2025-09-03 08:32:38.781
22	unclaimed_1753906423772_4aedo5x3t	6	18	1	1	t	2025-09-03 08:33:35.281	2025-09-03 08:33:35.281
23	unclaimed_1753906423772_4aedo5x3t	6	19	1	1	t	2025-09-03 08:36:10.947	2025-09-03 08:36:10.947
24	unclaimed_1753906423772_4aedo5x3t	6	20	1	1	t	2025-09-03 08:38:49.414	2025-09-03 08:38:49.414
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, email, password, first_name, last_name, profile_image_url, username, wallet_address, twitter_handle, twitter_url, creda_points, weekly_creda, last_creda_week_reset, daily_streak, last_active_date, grs_score, grs_percentile, email_verified, auth_provider, referral_code, has_invite_access, is_claimed, is_unclaimed_profile, claimed_at, created_by, onboarding_completed_at, bio, linkedin_url, github_url, discord_handle, telegram_handle, governance_interests, profile_completed_at, created_at, updated_at, profile_type, access_id, full_access_activated_at, invite_codes_available, total_invites_sent, successful_invites, last_invite_creda_milestone, invited_by, invite_code_used, longest_streak, last_streak_date, wallet_verification_tx_hash, is_suspended, suspended_at, suspension_reason) FROM stdin;
1953113551893073922	\N	\N	Alecia	\N	https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png	Alecia740545	\N	Alecia740545	https://x.com/Alecia740545	1375	0	2025-08-10 22:33:17.585723	0	\N	1558	78	f	twitter	MTk1MzEx	t	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-10 22:33:17.585723	2025-08-18 13:12:28.076	member	1953113551893073922	2025-08-10 22:35:06.068+00	3	0	0	0	\N	\N	0	\N	\N	f	\N	\N
unclaimed_1753701743381_69oe5eznf	\N	\N	DAO	AI 	\N	daoagents	\N	daoagents	https://x.com/daoagents	2	0	2025-07-28 11:22:23.418214	0	2025-07-28 11:22:23.381	1768	90	f	unclaimed	\N	f	f	t	\N	1940567468453367808	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-28 11:22:23.381	2025-09-03 11:05:51.965	member	\N	\N	3	0	0	0	\N	\N	0	\N	\N	f	\N	\N
unclaimed_1753896873146_gnsrpgoq5	\N	\N	Octoshi	\N	\N	0ctoshi	\N	0ctoshi	https://x.com/0ctoshi	0	0	2025-07-30 17:34:33.183005	0	2025-07-30 17:34:33.146	1300	50	f	unclaimed	\N	f	f	t	\N	1940567468453367808	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-30 17:34:33.146	2025-08-04 16:16:43.2681	member	\N	\N	3	0	0	0	\N	\N	0	\N	\N	f	\N	\N
unclaimed_1753976411439_e6jc6s5w5	\N	\N	Test777	\N	\N	test777	\N	test777	https://x.com/test777	0	0	2025-07-31 15:40:11.477523	0	2025-07-31 15:40:11.439	1300	50	f	unclaimed	\N	f	f	t	\N	1940567468453367808	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-31 15:40:11.439	2025-08-04 16:16:43.2681	member	\N	\N	3	0	0	0	\N	\N	0	\N	\N	f	\N	\N
unclaimed_1754047107989_jorwaa1d2	\N	\N	Last	Test	\N	lasttest	\N	lasttest	https://x.com/lasttest	0	0	2025-08-01 11:18:28.027223	0	2025-08-01 11:18:27.989	1300	50	f	unclaimed	\N	f	f	t	\N	1940567468453367808	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-01 11:18:27.989	2025-08-04 16:16:43.2681	organisation	\N	\N	3	0	0	0	\N	\N	0	\N	\N	f	\N	\N
unclaimed_1753893705381_eeppyn035	\N	\N	Xeonusify	\N	\N	Xeonusify	\N	Xeonusify	https://x.com/Xeonusify	0	0	2025-07-30 16:41:45.419403	0	2025-07-30 16:41:45.381	1300	50	f	unclaimed	\N	f	f	t	\N	1940567468453367808	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-30 16:41:45.381	2025-08-04 16:16:43.2681	member	\N	\N	3	0	0	0	\N	\N	0	\N	\N	f	\N	\N
unclaimed_1753718596277_lxvbe0r2g	\N	\N	Chaos	Labs	\N	chaos_labs	\N	chaos_labs	https://x.com/chaos_labs	0	0	2025-07-28 16:03:16.317062	0	2025-07-28 16:03:16.277	1691	40	f	unclaimed	\N	f	f	t	\N	1940567468453367808	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-28 16:03:16.277	2025-07-29 21:04:28.519	member	\N	\N	3	0	0	0	\N	\N	0	\N	\N	f	\N	\N
unclaimed_1754931413976_tdkck1zod	\N	\N	Test	777777	\N	test7777777	\N	test7777777	https://x.com/test7777777	15	0	2025-08-11 16:56:54.014166	0	2025-08-11 16:56:53.976	1315	63	f	unclaimed	\N	f	f	t	\N	1953113551893073922	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-11 16:56:53.976	2025-08-11 16:59:06.678	member	\N	\N	3	0	0	0	\N	\N	0	\N	\N	f	\N	\N
unclaimed_1754325122482_cqyin11i0	\N	\N	Hamster4	\N	\N	hamster3	\N	hamster3	https://x.com/hamster3	0	0	2025-08-04 16:32:02.519994	0	2025-08-04 16:32:02.482	1300	50	f	unclaimed	\N	f	f	t	\N	1940567468453367808	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-04 16:32:02.482	2025-08-04 16:32:02.555	member	\N	\N	3	0	0	0	\N	\N	0	\N	\N	f	\N	\N
unclaimed_1754350236092_z31grdc8w	\N	\N	May	Traver	https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png	TraverMay0909	\N	TraverMay0909	https://x.com/TraverMay0909	10	0	2025-08-04 23:30:36.129302	0	2025-08-04 23:30:36.092	1333	64	f	twitter	\N	t	t	f	2025-08-04 23:34:13.508	1940567468453367808	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-04 23:30:36.092	2025-08-08 14:02:12.037	member	1952511351127212032	\N	3	0	0	0	\N	\N	0	\N	\N	f	\N	\N
unclaimed_1754443622811_h0dewav4n	\N	\N	kmkm	\N	\N	knj	\N	knj	https://x.com/knj	2	0	2025-08-06 01:27:02.849422	0	2025-08-06 01:27:02.811	1285	0	f	unclaimed	\N	f	f	t	\N	1940567468453367808	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-06 01:27:02.811	2025-08-06 01:28:03.459	member	\N	\N	3	0	0	0	\N	\N	0	\N	\N	f	\N	\N
unclaimed_1756898901215_md90l482r	\N	\N	dwehbdhewd	\N	\N	kpk_dwdnwek	\N	kpk_dwdnwek	https://x.com/kpk_dwdnwek	0	0	2025-09-03 11:28:21.252588	0	2025-09-03 11:28:21.215	1303	38	f	unclaimed	\N	f	f	t	\N	1940567468453367808	\N	\N	\N	\N	\N	\N	\N	\N	2025-09-03 11:28:21.215	2025-09-03 11:28:37.361	organisation	\N	\N	0	0	0	0	\N	\N	0	\N	\N	f	\N	\N
1943623053071765504	\N	\N	Max	Stager	https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png	max_stager098	\N	max_stager098	https://x.com/max_stager098	860	0	2025-08-04 13:46:04.539013	0	\N	1558	72	f	twitter	\N	t	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-04 13:46:04.539013	2025-08-18 18:39:30.145	member	1943623053071765504	\N	3	0	0	0	\N	\N	0	\N	\N	f	\N	\N
1955633228036886528	\N	\N	Jason	Band	https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png	JasonBand445217	\N	JasonBand445217	https://x.com/JasonBand445217	130	0	2025-08-13 14:28:55.142503	0	\N	1300	0	f	twitter	MTk1NTYz	t	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-13 14:28:55.142503	2025-08-14 14:41:45.366	member	1955633228036886528	2025-08-13 21:37:53.46+00	3	0	0	0	1940567468453367808	QHCTT7VN	0	\N	\N	f	\N	\N
unclaimed_1757370896168_2mgv3qos2	\N	\N	fefefef	\N	\N	daoagentsdwdewd	\N	daoagentsdwdewd	https://x.com/daoagentsdwdewd	0	0	2025-09-08 22:34:56.205203	0	2025-09-08 22:34:56.168	1300	50	f	unclaimed	\N	f	f	t	\N	1940567468453367808	\N	\N	\N	\N	\N	\N	\N	\N	2025-09-08 22:34:56.168	2025-09-08 22:34:56.246	member	\N	\N	0	0	0	0	\N	\N	0	\N	\N	f	\N	\N
unclaimed_1755544327395_kpafyg4ki	\N	\N	Xlife	\N	\N	xlife	\N	xlife	https://x.com/xlife	0	0	2025-08-18 19:12:07.432146	0	2025-08-18 19:12:07.395	1300	50	f	unclaimed	\N	f	f	t	\N	1940567468453367808	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-18 19:12:07.395	2025-08-18 19:12:07.48	organisation	\N	\N	0	0	0	0	\N	\N	0	\N	\N	f	\N	\N
unclaimed_1754048806293_3eppwfq0a	\N	\N	BCD	\N	\N	BCDDAO	\N	BCDDAO	https://x.com/BCDDAO	0	0	2025-08-01 11:46:46.328945	0	2025-08-01 11:46:46.293	1390	64	f	unclaimed	\N	f	f	t	\N	1940567468453367808	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-01 11:46:46.293	2025-09-08 22:55:37.777	organisation	\N	\N	3	0	0	0	\N	\N	0	\N	\N	f	\N	\N
unclaimed_1755544824214_l8o9ouoxv	\N	\N	Xlife2	\N	\N	xlife2	\N	xlife2	https://x.com/xlife2	15	0	2025-08-18 19:20:24.251238	0	2025-08-18 19:20:24.214	1325	55	f	unclaimed	\N	f	f	t	\N	1940567468453367808	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-18 19:20:24.214	2025-08-18 19:20:51.65	organisation	\N	\N	0	0	0	0	\N	\N	0	\N	\N	f	\N	\N
1955002803245682690	\N	\N	Owen	James	https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png	OwenJames670072	\N	OwenJames670072	https://x.com/OwenJames670072	1375	0	2025-08-11 20:38:34.201193	0	\N	1308	39	f	twitter	\N	t	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-11 20:38:34.201193	2025-08-18 18:39:31.148	member	1955002803245682690	\N	3	0	0	0	\N	\N	0	\N	\N	f	\N	\N
unclaimed_1754334930623_nayncpsyk	\N	\N	TM	\N	https://pbs.twimg.com/profile_images/1898086722505715712/44kguB2A_normal.jpg	DaoMasawi	\N	DaoMasawi	https://x.com/DaoMasawi	60	0	2025-08-04 19:15:30.662204	0	2025-08-04 19:15:30.623	1465	68	f	twitter	\N	t	t	f	2025-08-04 20:12:51.125	1940567468453367808	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-04 19:15:30.623	2025-09-08 22:50:35.708	member	unclaimed_1754334930623_nayncpsyk	\N	3	0	0	0	\N	\N	0	\N	\N	f	\N	\N
unclaimed_1753906423772_4aedo5x3t	\N	\N	Amanda	G	https://pbs.twimg.com/profile_images/1949228104058105856/tfR3oTmF_normal.jpg	amandagieschen	\N	amandagieschen	https://x.com/amandagieschen	935	145	2025-07-30 20:13:43.807552	5	2025-07-30 20:13:43.772	1857	91	f	twitter	dW5jbGFp	t	t	f	2025-09-03 08:27:32.43	1940567468453367808	2025-09-03 08:30:19.056	\N	\N	\N	\N	\N	\N	\N	2025-07-30 20:13:43.772	2025-11-05 09:30:13.417	member	915316175050964992	2025-09-03 08:29:38.991+00	3	0	0	0	\N	N6J1-M5WC-U85J-D7OO	5	2025-09-07 00:00:00	\N	f	\N	\N
unclaimed_1761057399602_oj87lsf6d	\N	\N	DayLight	\N	\N	daylight	\N	daylight	https://x.com/daylight	15	15	2025-10-21 14:36:39.647016	0	2025-10-21 14:36:39.602	1325	52	f	unclaimed	\N	f	f	t	\N	1940567468453367808	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-21 14:36:39.602	2025-10-21 14:36:47.341	member	\N	\N	0	0	0	0	\N	\N	0	\N	\N	f	\N	\N
unclaimed_1761077625620_h9olo856d	\N	\N	lifescen	\N	\N	lifescan	\N	lifescan	https://x.com/lifescan	15	15	2025-10-21 20:13:45.657533	0	2025-10-21 20:13:45.62	1325	50	f	unclaimed	\N	f	f	t	\N	1940567468453367808	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-21 20:13:45.62	2025-10-21 20:14:11.693	member	\N	\N	0	0	0	0	\N	\N	0	\N	\N	f	\N	\N
unclaimed_1761590984358_cylskgzq6	\N	\N	Newman	2000	\N	newman2000	\N	newman2000	https://x.com/newman2000	15	15	2025-10-27 18:49:44.396089	0	2025-10-27 18:49:44.358	1325	48	f	unclaimed	\N	f	f	t	\N	1940567468453367808	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-27 18:49:44.358	2025-10-27 18:50:24.072	member	\N	\N	0	0	0	0	\N	\N	0	\N	\N	f	\N	\N
unclaimed_1761598725591_bwyuqfwfn	\N	\N	newhan	\N	\N	newjh	\N	newjh	https://x.com/newjh	2	2	2025-10-27 20:58:45.629415	0	2025-10-27 20:58:45.591	1285	0	f	unclaimed	\N	f	f	t	\N	1940567468453367808	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-27 20:58:45.591	2025-10-27 20:59:30.609	member	\N	\N	0	0	0	0	\N	\N	0	\N	\N	f	\N	\N
unclaimed_1761996019871_w10xye861	\N	\N	Like	Mike	\N	likemike	\N	likemike	https://x.com/likemike	2	2	2025-11-01 11:20:20.028725	0	2025-11-01 11:20:19.871	1285	0	f	unclaimed	\N	f	f	t	\N	1940567468453367808	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-01 11:20:19.871	2025-11-01 11:21:01.807	member	\N	\N	0	0	0	0	\N	\N	0	\N	\N	f	\N	\N
1940567468453367808	\N	\N	Masterlife24	\N	https://pbs.twimg.com/profile_images/1951595838657941504/iw5kUWCF_normal.jpg	Masterlife_24	0xad42032d6bb4b1cf3fa780405daeb2392786abd9	Masterlife_24	https://x.com/Masterlife_24	10030	7490	2025-07-24 20:28:27.350738	1	2025-07-28 13:49:42.787	2800	95	f	twitter	MTk0MDU2	t	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-24 20:28:27.350738	2025-11-26 18:02:55.613	member	1940567468453367808	2025-08-10 22:09:58.821+00	3	0	0	0	\N	\N	2	2025-10-21 00:00:00	0xb5ee0c75b6a5c7b780e60c840bc22aa2c17206a52d4dbe1e74943e6da7e12c77	f	\N	\N
unclaimed_1762003515587_tgxl9s7dk	\N	\N	Manymen	\N	\N	manymen	\N	manymen	https://x.com/manymen	2	2	2025-11-01 13:25:15.625894	0	2025-11-01 13:25:15.587	1285	0	f	unclaimed	\N	f	f	t	\N	1940567468453367808	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-01 13:25:15.587	2025-11-01 13:26:24.072	member	\N	\N	0	0	0	0	\N	\N	0	\N	\N	f	\N	\N
unclaimed_1762503476265_91xpb7k0o	\N	\N	Joshyeah	\N	\N	joshyeah	\N	joshyeah	https://x.com/joshyeah	15	15	2025-11-07 08:17:56.302021	0	2025-11-07 08:17:56.265	1325	52	f	unclaimed	\N	f	f	t	\N	1940567468453367808	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-07 08:17:56.265	2025-11-07 08:18:20.775	member	\N	\N	0	0	0	0	\N	\N	0	\N	\N	f	\N	\N
\.


--
-- Data for Name: votes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.votes (id, user_id, target_type, target_id, vote_type, created_at) FROM stdin;
1	1940567468453367808	review	1	upvote	2025-07-28 15:27:10.902331
2	1940567468453367808	review	4	upvote	2025-07-28 16:35:42.937444
3	1940567468453367808	review	12	upvote	2025-07-30 17:32:20.926391
4	1940567468453367808	review	21	upvote	2025-08-01 11:24:29.401308
5	1940567468453367808	review	25	upvote	2025-08-05 14:28:37.22895
6	1940567468453367808	review	36	upvote	2025-09-03 11:28:44.607545
7	1940567468453367808	review	37	upvote	2025-09-03 11:28:50.731207
8	unclaimed_1753906423772_4aedo5x3t	review	37	upvote	2025-09-04 19:33:54.451783
9	unclaimed_1753906423772_4aedo5x3t	review	34	upvote	2025-09-04 21:14:36.177805
10	1940567468453367808	review	35	upvote	2025-09-06 21:04:18.335816
11	1940567468453367808	review	39	upvote	2025-10-21 14:38:08.420799
\.


--
-- Name: admin_flags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.admin_flags_id_seq', 1, false);


--
-- Name: admin_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.admin_sessions_id_seq', 1, false);


--
-- Name: business_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.business_profiles_id_seq', 1, true);


--
-- Name: comment_votes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.comment_votes_id_seq', 5, true);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.comments_id_seq', 48, true);


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.companies_id_seq', 12, true);


--
-- Name: company_admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.company_admins_id_seq', 2, true);


--
-- Name: company_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.company_users_id_seq', 1, true);


--
-- Name: content_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.content_reports_id_seq', 1, false);


--
-- Name: daily_tasks_config_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.daily_tasks_config_id_seq', 4, true);


--
-- Name: daily_tasks_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.daily_tasks_progress_id_seq', 1, false);


--
-- Name: daos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.daos_id_seq', 18, true);


--
-- Name: email_verification_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.email_verification_codes_id_seq', 1, false);


--
-- Name: governance_issues_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.governance_issues_id_seq', 36, true);


--
-- Name: grs_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.grs_events_id_seq', 58, true);


--
-- Name: invite_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.invite_codes_id_seq', 367, true);


--
-- Name: invite_rewards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.invite_rewards_id_seq', 1, false);


--
-- Name: invite_submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.invite_submissions_id_seq', 1, false);


--
-- Name: invite_usage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.invite_usage_id_seq', 1, false);


--
-- Name: market_positions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.market_positions_id_seq', 1, false);


--
-- Name: market_settlements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.market_settlements_id_seq', 1, false);


--
-- Name: market_trades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.market_trades_id_seq', 1, false);


--
-- Name: notification_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.notification_settings_id_seq', 2, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.notifications_id_seq', 46, true);


--
-- Name: prediction_markets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.prediction_markets_id_seq', 1, false);


--
-- Name: project_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.project_reviews_id_seq', 57, true);


--
-- Name: quest_tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.quest_tasks_id_seq', 20, true);


--
-- Name: quests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.quests_id_seq', 6, true);


--
-- Name: referrals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.referrals_id_seq', 1, false);


--
-- Name: review_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.review_comments_id_seq', 21, true);


--
-- Name: review_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.review_reports_id_seq', 9, true);


--
-- Name: review_share_clicks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.review_share_clicks_id_seq', 1, false);


--
-- Name: review_shares_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.review_shares_id_seq', 10, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.reviews_id_seq', 45, true);


--
-- Name: space_activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.space_activities_id_seq', 1, false);


--
-- Name: space_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.space_members_id_seq', 1, false);


--
-- Name: space_votes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.space_votes_id_seq', 1, true);


--
-- Name: spaces_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.spaces_id_seq', 1, true);


--
-- Name: stance_votes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.stance_votes_id_seq', 18, true);


--
-- Name: user_dao_follows_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_dao_follows_id_seq', 3, true);


--
-- Name: user_dao_scores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_dao_scores_id_seq', 441, true);


--
-- Name: user_quest_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_quest_progress_id_seq', 7, true);


--
-- Name: user_quest_task_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_quest_task_progress_id_seq', 24, true);


--
-- Name: votes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.votes_id_seq', 11, true);


--
-- Name: xp_activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.xp_activities_id_seq', 289, true);


--
-- Name: admin_flags admin_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admin_flags
    ADD CONSTRAINT admin_flags_pkey PRIMARY KEY (id);


--
-- Name: admin_sessions admin_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admin_sessions
    ADD CONSTRAINT admin_sessions_pkey PRIMARY KEY (id);


--
-- Name: admin_sessions admin_sessions_session_token_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admin_sessions
    ADD CONSTRAINT admin_sessions_session_token_unique UNIQUE (session_token);


--
-- Name: business_profiles business_profiles_invite_code_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.business_profiles
    ADD CONSTRAINT business_profiles_invite_code_key UNIQUE (invite_code);


--
-- Name: business_profiles business_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.business_profiles
    ADD CONSTRAINT business_profiles_pkey PRIMARY KEY (id);


--
-- Name: business_profiles business_profiles_slug_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.business_profiles
    ADD CONSTRAINT business_profiles_slug_key UNIQUE (slug);


--
-- Name: comment_votes comment_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.comment_votes
    ADD CONSTRAINT comment_votes_pkey PRIMARY KEY (id);


--
-- Name: comment_votes comment_votes_user_id_comment_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.comment_votes
    ADD CONSTRAINT comment_votes_user_id_comment_id_unique UNIQUE (user_id, comment_id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: companies companies_external_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_external_id_key UNIQUE (external_id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: companies companies_slug_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_slug_key UNIQUE (slug);


--
-- Name: company_admins company_admins_company_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.company_admins
    ADD CONSTRAINT company_admins_company_id_user_id_key UNIQUE (company_id, user_id);


--
-- Name: company_admins company_admins_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.company_admins
    ADD CONSTRAINT company_admins_pkey PRIMARY KEY (id);


--
-- Name: company_users company_users_email_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.company_users
    ADD CONSTRAINT company_users_email_key UNIQUE (email);


--
-- Name: company_users company_users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.company_users
    ADD CONSTRAINT company_users_pkey PRIMARY KEY (id);


--
-- Name: content_reports content_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.content_reports
    ADD CONSTRAINT content_reports_pkey PRIMARY KEY (id);


--
-- Name: daily_tasks_config daily_tasks_config_config_key_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.daily_tasks_config
    ADD CONSTRAINT daily_tasks_config_config_key_key UNIQUE (config_key);


--
-- Name: daily_tasks_config daily_tasks_config_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.daily_tasks_config
    ADD CONSTRAINT daily_tasks_config_pkey PRIMARY KEY (id);


--
-- Name: daily_tasks_progress daily_tasks_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.daily_tasks_progress
    ADD CONSTRAINT daily_tasks_progress_pkey PRIMARY KEY (id);


--
-- Name: daily_tasks_progress daily_tasks_progress_user_id_task_date_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.daily_tasks_progress
    ADD CONSTRAINT daily_tasks_progress_user_id_task_date_key UNIQUE (user_id, task_date);


--
-- Name: daos daos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.daos
    ADD CONSTRAINT daos_pkey PRIMARY KEY (id);


--
-- Name: daos daos_slug_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.daos
    ADD CONSTRAINT daos_slug_unique UNIQUE (slug);


--
-- Name: email_verification_codes email_verification_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.email_verification_codes
    ADD CONSTRAINT email_verification_codes_pkey PRIMARY KEY (id);


--
-- Name: governance_issues governance_issues_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.governance_issues
    ADD CONSTRAINT governance_issues_pkey PRIMARY KEY (id);


--
-- Name: grs_events grs_events_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.grs_events
    ADD CONSTRAINT grs_events_pkey PRIMARY KEY (id);


--
-- Name: invite_codes invite_codes_code_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invite_codes
    ADD CONSTRAINT invite_codes_code_unique UNIQUE (code);


--
-- Name: invite_codes invite_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invite_codes
    ADD CONSTRAINT invite_codes_pkey PRIMARY KEY (id);


--
-- Name: invite_rewards invite_rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invite_rewards
    ADD CONSTRAINT invite_rewards_pkey PRIMARY KEY (id);


--
-- Name: invite_submissions invite_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invite_submissions
    ADD CONSTRAINT invite_submissions_pkey PRIMARY KEY (id);


--
-- Name: invite_usage invite_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invite_usage
    ADD CONSTRAINT invite_usage_pkey PRIMARY KEY (id);


--
-- Name: market_positions market_positions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.market_positions
    ADD CONSTRAINT market_positions_pkey PRIMARY KEY (id);


--
-- Name: market_positions market_positions_user_id_market_id_outcome_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.market_positions
    ADD CONSTRAINT market_positions_user_id_market_id_outcome_key UNIQUE (user_id, market_id, outcome);


--
-- Name: market_settlements market_settlements_market_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.market_settlements
    ADD CONSTRAINT market_settlements_market_id_key UNIQUE (market_id);


--
-- Name: market_settlements market_settlements_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.market_settlements
    ADD CONSTRAINT market_settlements_pkey PRIMARY KEY (id);


--
-- Name: market_trades market_trades_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.market_trades
    ADD CONSTRAINT market_trades_pkey PRIMARY KEY (id);


--
-- Name: notification_settings notification_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT notification_settings_pkey PRIMARY KEY (id);


--
-- Name: notification_settings notification_settings_user_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT notification_settings_user_id_key UNIQUE (user_id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: prediction_markets prediction_markets_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.prediction_markets
    ADD CONSTRAINT prediction_markets_pkey PRIMARY KEY (id);


--
-- Name: prediction_markets prediction_markets_stance_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.prediction_markets
    ADD CONSTRAINT prediction_markets_stance_id_key UNIQUE (stance_id);


--
-- Name: project_reviews project_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.project_reviews
    ADD CONSTRAINT project_reviews_pkey PRIMARY KEY (id);


--
-- Name: quest_tasks quest_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quest_tasks
    ADD CONSTRAINT quest_tasks_pkey PRIMARY KEY (id);


--
-- Name: quests quests_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quests
    ADD CONSTRAINT quests_pkey PRIMARY KEY (id);


--
-- Name: referrals referrals_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_pkey PRIMARY KEY (id);


--
-- Name: review_comments review_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review_comments
    ADD CONSTRAINT review_comments_pkey PRIMARY KEY (id);


--
-- Name: review_reports review_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review_reports
    ADD CONSTRAINT review_reports_pkey PRIMARY KEY (id);


--
-- Name: review_share_clicks review_share_clicks_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review_share_clicks
    ADD CONSTRAINT review_share_clicks_pkey PRIMARY KEY (id);


--
-- Name: review_shares review_shares_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review_shares
    ADD CONSTRAINT review_shares_pkey PRIMARY KEY (id);


--
-- Name: review_shares review_shares_share_token_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review_shares
    ADD CONSTRAINT review_shares_share_token_key UNIQUE (share_token);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_reviewer_id_reviewed_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_reviewer_id_reviewed_user_id_unique UNIQUE (reviewer_id, reviewed_user_id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: space_activities space_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.space_activities
    ADD CONSTRAINT space_activities_pkey PRIMARY KEY (id);


--
-- Name: space_members space_members_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.space_members
    ADD CONSTRAINT space_members_pkey PRIMARY KEY (id);


--
-- Name: space_members space_members_space_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.space_members
    ADD CONSTRAINT space_members_space_id_user_id_key UNIQUE (space_id, user_id);


--
-- Name: space_votes space_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.space_votes
    ADD CONSTRAINT space_votes_pkey PRIMARY KEY (id);


--
-- Name: space_votes space_votes_space_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.space_votes
    ADD CONSTRAINT space_votes_space_id_user_id_key UNIQUE (space_id, user_id);


--
-- Name: spaces spaces_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.spaces
    ADD CONSTRAINT spaces_pkey PRIMARY KEY (id);


--
-- Name: spaces spaces_slug_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.spaces
    ADD CONSTRAINT spaces_slug_key UNIQUE (slug);


--
-- Name: stance_votes stance_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.stance_votes
    ADD CONSTRAINT stance_votes_pkey PRIMARY KEY (id);


--
-- Name: stance_votes stance_votes_user_id_stance_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.stance_votes
    ADD CONSTRAINT stance_votes_user_id_stance_id_unique UNIQUE (user_id, stance_id);


--
-- Name: user_dao_follows user_dao_follows_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_dao_follows
    ADD CONSTRAINT user_dao_follows_pkey PRIMARY KEY (id);


--
-- Name: user_dao_scores user_dao_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_dao_scores
    ADD CONSTRAINT user_dao_scores_pkey PRIMARY KEY (id);


--
-- Name: user_dao_scores user_dao_scores_user_id_dao_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_dao_scores
    ADD CONSTRAINT user_dao_scores_user_id_dao_id_unique UNIQUE (user_id, dao_id);


--
-- Name: user_quest_progress user_quest_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_quest_progress
    ADD CONSTRAINT user_quest_progress_pkey PRIMARY KEY (id);


--
-- Name: user_quest_progress user_quest_progress_user_id_quest_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_quest_progress
    ADD CONSTRAINT user_quest_progress_user_id_quest_id_key UNIQUE (user_id, quest_id);


--
-- Name: user_quest_task_progress user_quest_task_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_quest_task_progress
    ADD CONSTRAINT user_quest_task_progress_pkey PRIMARY KEY (id);


--
-- Name: user_quest_task_progress user_quest_task_progress_user_id_quest_id_task_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_quest_task_progress
    ADD CONSTRAINT user_quest_task_progress_user_id_quest_id_task_id_key UNIQUE (user_id, quest_id, task_id);


--
-- Name: users users_access_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_access_id_key UNIQUE (access_id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_referral_code_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_referral_code_unique UNIQUE (referral_code);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: votes votes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_pkey PRIMARY KEY (id);


--
-- Name: creda_activities xp_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.creda_activities
    ADD CONSTRAINT xp_activities_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- Name: admin_flags admin_flags_investigated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admin_flags
    ADD CONSTRAINT admin_flags_investigated_by_fkey FOREIGN KEY (investigated_by) REFERENCES public.users(id);


--
-- Name: admin_flags admin_flags_target_invite_code_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admin_flags
    ADD CONSTRAINT admin_flags_target_invite_code_id_fkey FOREIGN KEY (target_invite_code_id) REFERENCES public.invite_codes(id);


--
-- Name: admin_flags admin_flags_target_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admin_flags
    ADD CONSTRAINT admin_flags_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES public.users(id);


--
-- Name: business_profiles business_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.business_profiles
    ADD CONSTRAINT business_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: comment_votes comment_votes_comment_id_comments_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.comment_votes
    ADD CONSTRAINT comment_votes_comment_id_comments_id_fk FOREIGN KEY (comment_id) REFERENCES public.comments(id);


--
-- Name: comment_votes comment_votes_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.comment_votes
    ADD CONSTRAINT comment_votes_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: comments comments_author_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_author_id_users_id_fk FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- Name: comments comments_issue_id_governance_issues_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_issue_id_governance_issues_id_fk FOREIGN KEY (issue_id) REFERENCES public.governance_issues(id);


--
-- Name: comments comments_parent_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.comments(id);


--
-- Name: company_admins company_admins_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.company_admins
    ADD CONSTRAINT company_admins_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: company_admins company_admins_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.company_admins
    ADD CONSTRAINT company_admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: company_users company_users_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.company_users
    ADD CONSTRAINT company_users_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: content_reports content_reports_reported_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.content_reports
    ADD CONSTRAINT content_reports_reported_by_fkey FOREIGN KEY (reported_by) REFERENCES public.users(id);


--
-- Name: daily_tasks_progress daily_tasks_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.daily_tasks_progress
    ADD CONSTRAINT daily_tasks_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: daos daos_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.daos
    ADD CONSTRAINT daos_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: governance_issues governance_issues_author_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.governance_issues
    ADD CONSTRAINT governance_issues_author_id_users_id_fk FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- Name: governance_issues governance_issues_dao_id_daos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.governance_issues
    ADD CONSTRAINT governance_issues_dao_id_daos_id_fk FOREIGN KEY (dao_id) REFERENCES public.daos(id);


--
-- Name: governance_issues governance_issues_space_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.governance_issues
    ADD CONSTRAINT governance_issues_space_id_fkey FOREIGN KEY (space_id) REFERENCES public.spaces(id);


--
-- Name: governance_issues governance_issues_target_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.governance_issues
    ADD CONSTRAINT governance_issues_target_user_id_users_id_fk FOREIGN KEY (target_user_id) REFERENCES public.users(id);


--
-- Name: grs_events grs_events_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.grs_events
    ADD CONSTRAINT grs_events_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: invite_codes invite_codes_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invite_codes
    ADD CONSTRAINT invite_codes_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: invite_codes invite_codes_used_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invite_codes
    ADD CONSTRAINT invite_codes_used_by_users_id_fk FOREIGN KEY (used_by) REFERENCES public.users(id);


--
-- Name: invite_rewards invite_rewards_invite_usage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invite_rewards
    ADD CONSTRAINT invite_rewards_invite_usage_id_fkey FOREIGN KEY (invite_usage_id) REFERENCES public.invite_usage(id);


--
-- Name: invite_rewards invite_rewards_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invite_rewards
    ADD CONSTRAINT invite_rewards_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: invite_submissions invite_submissions_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invite_submissions
    ADD CONSTRAINT invite_submissions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: invite_usage invite_usage_invite_code_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invite_usage
    ADD CONSTRAINT invite_usage_invite_code_id_fkey FOREIGN KEY (invite_code_id) REFERENCES public.invite_codes(id);


--
-- Name: invite_usage invite_usage_invited_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invite_usage
    ADD CONSTRAINT invite_usage_invited_user_id_fkey FOREIGN KEY (invited_user_id) REFERENCES public.users(id);


--
-- Name: invite_usage invite_usage_inviter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invite_usage
    ADD CONSTRAINT invite_usage_inviter_id_fkey FOREIGN KEY (inviter_id) REFERENCES public.users(id);


--
-- Name: market_positions market_positions_market_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.market_positions
    ADD CONSTRAINT market_positions_market_id_fkey FOREIGN KEY (market_id) REFERENCES public.prediction_markets(id);


--
-- Name: market_positions market_positions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.market_positions
    ADD CONSTRAINT market_positions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: market_settlements market_settlements_market_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.market_settlements
    ADD CONSTRAINT market_settlements_market_id_fkey FOREIGN KEY (market_id) REFERENCES public.prediction_markets(id);


--
-- Name: market_settlements market_settlements_stance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.market_settlements
    ADD CONSTRAINT market_settlements_stance_id_fkey FOREIGN KEY (stance_id) REFERENCES public.governance_issues(id);


--
-- Name: market_trades market_trades_market_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.market_trades
    ADD CONSTRAINT market_trades_market_id_fkey FOREIGN KEY (market_id) REFERENCES public.prediction_markets(id);


--
-- Name: market_trades market_trades_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.market_trades
    ADD CONSTRAINT market_trades_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: notification_settings notification_settings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT notification_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: notifications notifications_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: prediction_markets prediction_markets_stance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.prediction_markets
    ADD CONSTRAINT prediction_markets_stance_id_fkey FOREIGN KEY (stance_id) REFERENCES public.governance_issues(id);


--
-- Name: project_reviews project_reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.project_reviews
    ADD CONSTRAINT project_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: quest_tasks quest_tasks_quest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quest_tasks
    ADD CONSTRAINT quest_tasks_quest_id_fkey FOREIGN KEY (quest_id) REFERENCES public.quests(id) ON DELETE CASCADE;


--
-- Name: quest_tasks quest_tasks_target_dao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quest_tasks
    ADD CONSTRAINT quest_tasks_target_dao_id_fkey FOREIGN KEY (target_dao_id) REFERENCES public.daos(id);


--
-- Name: quest_tasks quest_tasks_target_stance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quest_tasks
    ADD CONSTRAINT quest_tasks_target_stance_id_fkey FOREIGN KEY (target_stance_id) REFERENCES public.governance_issues(id);


--
-- Name: quest_tasks quest_tasks_target_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quest_tasks
    ADD CONSTRAINT quest_tasks_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES public.users(id);


--
-- Name: referrals referrals_referred_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_referred_id_users_id_fk FOREIGN KEY (referred_id) REFERENCES public.users(id);


--
-- Name: referrals referrals_referrer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_referrer_id_users_id_fk FOREIGN KEY (referrer_id) REFERENCES public.users(id);


--
-- Name: review_comments review_comments_author_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review_comments
    ADD CONSTRAINT review_comments_author_id_users_id_fk FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- Name: review_comments review_comments_parent_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review_comments
    ADD CONSTRAINT review_comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.review_comments(id);


--
-- Name: review_comments review_comments_review_id_reviews_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review_comments
    ADD CONSTRAINT review_comments_review_id_reviews_id_fk FOREIGN KEY (review_id) REFERENCES public.reviews(id);


--
-- Name: review_reports review_reports_reported_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review_reports
    ADD CONSTRAINT review_reports_reported_by_fkey FOREIGN KEY (reported_by) REFERENCES public.users(id);


--
-- Name: review_reports review_reports_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review_reports
    ADD CONSTRAINT review_reports_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.project_reviews(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_reviewed_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_reviewed_business_id_fkey FOREIGN KEY (reviewed_business_id) REFERENCES public.business_profiles(id);


--
-- Name: reviews reviews_reviewed_dao_id_daos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_reviewed_dao_id_daos_id_fk FOREIGN KEY (reviewed_dao_id) REFERENCES public.daos(id);


--
-- Name: reviews reviews_reviewed_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_reviewed_user_id_users_id_fk FOREIGN KEY (reviewed_user_id) REFERENCES public.users(id);


--
-- Name: reviews reviews_reviewer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_reviewer_id_users_id_fk FOREIGN KEY (reviewer_id) REFERENCES public.users(id);


--
-- Name: reviews reviews_space_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_space_id_fkey FOREIGN KEY (space_id) REFERENCES public.spaces(id);


--
-- Name: space_activities space_activities_space_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.space_activities
    ADD CONSTRAINT space_activities_space_id_fkey FOREIGN KEY (space_id) REFERENCES public.spaces(id) ON DELETE CASCADE;


--
-- Name: space_activities space_activities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.space_activities
    ADD CONSTRAINT space_activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: space_members space_members_space_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.space_members
    ADD CONSTRAINT space_members_space_id_fkey FOREIGN KEY (space_id) REFERENCES public.spaces(id) ON DELETE CASCADE;


--
-- Name: space_members space_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.space_members
    ADD CONSTRAINT space_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: space_votes space_votes_space_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.space_votes
    ADD CONSTRAINT space_votes_space_id_fkey FOREIGN KEY (space_id) REFERENCES public.spaces(id) ON DELETE CASCADE;


--
-- Name: space_votes space_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.space_votes
    ADD CONSTRAINT space_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: spaces spaces_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.spaces
    ADD CONSTRAINT spaces_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: stance_votes stance_votes_stance_id_governance_issues_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.stance_votes
    ADD CONSTRAINT stance_votes_stance_id_governance_issues_id_fk FOREIGN KEY (stance_id) REFERENCES public.governance_issues(id);


--
-- Name: stance_votes stance_votes_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.stance_votes
    ADD CONSTRAINT stance_votes_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_dao_follows user_dao_follows_dao_id_daos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_dao_follows
    ADD CONSTRAINT user_dao_follows_dao_id_daos_id_fk FOREIGN KEY (dao_id) REFERENCES public.daos(id);


--
-- Name: user_dao_follows user_dao_follows_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_dao_follows
    ADD CONSTRAINT user_dao_follows_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_dao_scores user_dao_scores_dao_id_daos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_dao_scores
    ADD CONSTRAINT user_dao_scores_dao_id_daos_id_fk FOREIGN KEY (dao_id) REFERENCES public.daos(id);


--
-- Name: user_dao_scores user_dao_scores_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_dao_scores
    ADD CONSTRAINT user_dao_scores_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_quest_progress user_quest_progress_quest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_quest_progress
    ADD CONSTRAINT user_quest_progress_quest_id_fkey FOREIGN KEY (quest_id) REFERENCES public.quests(id) ON DELETE CASCADE;


--
-- Name: user_quest_task_progress user_quest_task_progress_quest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_quest_task_progress
    ADD CONSTRAINT user_quest_task_progress_quest_id_fkey FOREIGN KEY (quest_id) REFERENCES public.quests(id) ON DELETE CASCADE;


--
-- Name: user_quest_task_progress user_quest_task_progress_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_quest_task_progress
    ADD CONSTRAINT user_quest_task_progress_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.quest_tasks(id) ON DELETE CASCADE;


--
-- Name: user_quest_task_progress user_quest_task_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_quest_task_progress
    ADD CONSTRAINT user_quest_task_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users users_invited_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES public.users(id);


--
-- Name: votes votes_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: creda_activities xp_activities_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.creda_activities
    ADD CONSTRAINT xp_activities_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict NhY6UvmMup8ACLBrgEI5RyC4ISVOI05DgcqZscSTJqVDOZpf8YuE54X8rIBt0qK

