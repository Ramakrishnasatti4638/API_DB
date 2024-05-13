PGDMP  -            
        |            MetroCardManagement    16.2    16.2     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16612    MetroCardManagement    DATABASE     �   CREATE DATABASE "MetroCardManagement" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
 %   DROP DATABASE "MetroCardManagement";
                postgres    false            �            1259    16635    fair    TABLE     �   CREATE TABLE public.fair (
    "TicketID" integer NOT NULL,
    "FromLocation" character varying(50) NOT NULL,
    "ToLocation" character varying(50) NOT NULL,
    "Price" numeric(10,2) NOT NULL
);
    DROP TABLE public.fair;
       public         heap    postgres    false            �            1259    16634    fair_TicketID_seq    SEQUENCE     �   CREATE SEQUENCE public."fair_TicketID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public."fair_TicketID_seq";
       public          postgres    false    220            �           0    0    fair_TicketID_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public."fair_TicketID_seq" OWNED BY public.fair."TicketID";
          public          postgres    false    219            �            1259    16621    travel    TABLE     
  CREATE TABLE public.travel (
    "TravelID" integer NOT NULL,
    "CardNumber" integer NOT NULL,
    "FromLocation" character varying(50) NOT NULL,
    "ToLocation" character varying(50) NOT NULL,
    "Date" date NOT NULL,
    "TravelCost" numeric(10,2) NOT NULL
);
    DROP TABLE public.travel;
       public         heap    postgres    false            �            1259    16620    travel_TravelID_seq    SEQUENCE     �   CREATE SEQUENCE public."travel_TravelID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public."travel_TravelID_seq";
       public          postgres    false    218            �           0    0    travel_TravelID_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."travel_TravelID_seq" OWNED BY public.travel."TravelID";
          public          postgres    false    217            �            1259    16614    users    TABLE       CREATE TABLE public.users (
    "CardNumber" integer NOT NULL,
    "Name" character varying(50) NOT NULL,
    "UserName" character varying(50) NOT NULL,
    "UserPassword" character varying(50) NOT NULL,
    "UserPhone" character varying(20) NOT NULL,
    "UserBalance" numeric(10,2)
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    16613    users_CardNumber_seq    SEQUENCE     �   CREATE SEQUENCE public."users_CardNumber_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public."users_CardNumber_seq";
       public          postgres    false    216                        0    0    users_CardNumber_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public."users_CardNumber_seq" OWNED BY public.users."CardNumber";
          public          postgres    false    215            \           2604    16638    fair TicketID    DEFAULT     r   ALTER TABLE ONLY public.fair ALTER COLUMN "TicketID" SET DEFAULT nextval('public."fair_TicketID_seq"'::regclass);
 >   ALTER TABLE public.fair ALTER COLUMN "TicketID" DROP DEFAULT;
       public          postgres    false    219    220    220            [           2604    16624    travel TravelID    DEFAULT     v   ALTER TABLE ONLY public.travel ALTER COLUMN "TravelID" SET DEFAULT nextval('public."travel_TravelID_seq"'::regclass);
 @   ALTER TABLE public.travel ALTER COLUMN "TravelID" DROP DEFAULT;
       public          postgres    false    217    218    218            Z           2604    16617    users CardNumber    DEFAULT     x   ALTER TABLE ONLY public.users ALTER COLUMN "CardNumber" SET DEFAULT nextval('public."users_CardNumber_seq"'::regclass);
 A   ALTER TABLE public.users ALTER COLUMN "CardNumber" DROP DEFAULT;
       public          postgres    false    215    216    216            �          0    16635    fair 
   TABLE DATA           Q   COPY public.fair ("TicketID", "FromLocation", "ToLocation", "Price") FROM stdin;
    public          postgres    false    220   �       �          0    16621    travel 
   TABLE DATA           n   COPY public.travel ("TravelID", "CardNumber", "FromLocation", "ToLocation", "Date", "TravelCost") FROM stdin;
    public          postgres    false    218   -       �          0    16614    users 
   TABLE DATA           m   COPY public.users ("CardNumber", "Name", "UserName", "UserPassword", "UserPhone", "UserBalance") FROM stdin;
    public          postgres    false    216   �                  0    0    fair_TicketID_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."fair_TicketID_seq"', 8, true);
          public          postgres    false    219                       0    0    travel_TravelID_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."travel_TravelID_seq"', 8, true);
          public          postgres    false    217                       0    0    users_CardNumber_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public."users_CardNumber_seq"', 6, true);
          public          postgres    false    215            b           2606    16640    fair fair_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.fair
    ADD CONSTRAINT fair_pkey PRIMARY KEY ("TicketID");
 8   ALTER TABLE ONLY public.fair DROP CONSTRAINT fair_pkey;
       public            postgres    false    220            `           2606    16626    travel travel_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.travel
    ADD CONSTRAINT travel_pkey PRIMARY KEY ("TravelID");
 <   ALTER TABLE ONLY public.travel DROP CONSTRAINT travel_pkey;
       public            postgres    false    218            ^           2606    16619    users users_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY ("CardNumber");
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    216            �   t   x�e�?@0����a�j�v0�M���U�����O�zO��E�:�,͐��RRa��s.삦n�~Hj�Q;���.�X�w�P��	���EI�������r��~����ًQ�c0�V?$      �   �   x���=� ����/m��е���qr9CSI
4D����Ѵ��m�� �si������r���e@�s����1>�_{����YI@�F
6�3�%�
���ͥ�)4�_K���j�n���0�s��^�]ag�4�K�m������.-c�	��Ns      �   w   x�M�1
�0�Y>��lɕ��#t�thM����@	Y���'�ٷ��3=��w||:P�P�U=� !bD	��-6l��N��@���s�_趌��V�n'���D^/�YX2�^vv�!���*"     