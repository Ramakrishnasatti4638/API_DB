PGDMP  	            
        |            SyncfusionLibrary    16.2    16.2     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16641    SyncfusionLibrary    DATABASE     �   CREATE DATABASE "SyncfusionLibrary" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
 #   DROP DATABASE "SyncfusionLibrary";
                postgres    false            �            1259    16650    books    TABLE     �   CREATE TABLE public.books (
    "BookID" integer NOT NULL,
    "BookName" character varying(50) NOT NULL,
    "AuthorName" character varying(50) NOT NULL,
    "BookCount" integer NOT NULL
);
    DROP TABLE public.books;
       public         heap    postgres    false            �            1259    16649    books_BookID_seq    SEQUENCE     �   CREATE SEQUENCE public."books_BookID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."books_BookID_seq";
       public          postgres    false    218            �           0    0    books_BookID_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."books_BookID_seq" OWNED BY public.books."BookID";
          public          postgres    false    217            �            1259    16685    borrows    TABLE     %  CREATE TABLE public.borrows (
    "BorrowID" integer NOT NULL,
    "BookID" integer NOT NULL,
    "UserID" integer NOT NULL,
    "BorrowedDate" date NOT NULL,
    "BorrowedBookCount" integer NOT NULL,
    "Status" character varying(50) NOT NULL,
    "PaidFineAmount" numeric(10,2) NOT NULL
);
    DROP TABLE public.borrows;
       public         heap    postgres    false            �            1259    16684    borrows_BorrowID_seq    SEQUENCE     �   CREATE SEQUENCE public."borrows_BorrowID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public."borrows_BorrowID_seq";
       public          postgres    false    220            �           0    0    borrows_BorrowID_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public."borrows_BorrowID_seq" OWNED BY public.borrows."BorrowID";
          public          postgres    false    219            �            1259    16643    users    TABLE     |  CREATE TABLE public.users (
    "UserID" integer NOT NULL,
    "Name" character varying(50) NOT NULL,
    "Gender" character varying(10) NOT NULL,
    "Department" character varying(10) NOT NULL,
    "UserPhone" character varying(20) NOT NULL,
    "UserEmail" character varying(50) NOT NULL,
    "UserPassword" character varying(50) NOT NULL,
    "WalletBalance" numeric(10,2)
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    16642    users_UserID_seq    SEQUENCE     �   CREATE SEQUENCE public."users_UserID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."users_UserID_seq";
       public          postgres    false    216                        0    0    users_UserID_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."users_UserID_seq" OWNED BY public.users."UserID";
          public          postgres    false    215            [           2604    16653    books BookID    DEFAULT     p   ALTER TABLE ONLY public.books ALTER COLUMN "BookID" SET DEFAULT nextval('public."books_BookID_seq"'::regclass);
 =   ALTER TABLE public.books ALTER COLUMN "BookID" DROP DEFAULT;
       public          postgres    false    217    218    218            \           2604    16688    borrows BorrowID    DEFAULT     x   ALTER TABLE ONLY public.borrows ALTER COLUMN "BorrowID" SET DEFAULT nextval('public."borrows_BorrowID_seq"'::regclass);
 A   ALTER TABLE public.borrows ALTER COLUMN "BorrowID" DROP DEFAULT;
       public          postgres    false    219    220    220            Z           2604    16646    users UserID    DEFAULT     p   ALTER TABLE ONLY public.users ALTER COLUMN "UserID" SET DEFAULT nextval('public."users_UserID_seq"'::regclass);
 =   ALTER TABLE public.users ALTER COLUMN "UserID" DROP DEFAULT;
       public          postgres    false    215    216    216            �          0    16650    books 
   TABLE DATA           P   COPY public.books ("BookID", "BookName", "AuthorName", "BookCount") FROM stdin;
    public          postgres    false    218          �          0    16685    borrows 
   TABLE DATA           �   COPY public.borrows ("BorrowID", "BookID", "UserID", "BorrowedDate", "BorrowedBookCount", "Status", "PaidFineAmount") FROM stdin;
    public          postgres    false    220   g       �          0    16643    users 
   TABLE DATA           �   COPY public.users ("UserID", "Name", "Gender", "Department", "UserPhone", "UserEmail", "UserPassword", "WalletBalance") FROM stdin;
    public          postgres    false    216   �                  0    0    books_BookID_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."books_BookID_seq"', 7, true);
          public          postgres    false    217                       0    0    borrows_BorrowID_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public."borrows_BorrowID_seq"', 8, true);
          public          postgres    false    219                       0    0    users_UserID_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."users_UserID_seq"', 5, true);
          public          postgres    false    215            `           2606    16655    books books_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY ("BookID");
 :   ALTER TABLE ONLY public.books DROP CONSTRAINT books_pkey;
       public            postgres    false    218            b           2606    16690    borrows borrows_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.borrows
    ADD CONSTRAINT borrows_pkey PRIMARY KEY ("BorrowID");
 >   ALTER TABLE ONLY public.borrows DROP CONSTRAINT borrows_pkey;
       public            postgres    false    220            ^           2606    16648    users users_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY ("UserID");
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    216            �   ?   x�3�tV�t,-��/2�4�2�����
q�rs:��p�pz#�7�	��6����� j�`      �   z   x�}�A
�0�uz��O����g�[�2��7F"��U���GIꃤ�>2�0����< d��'�q�|�b@�H��P/�����B#rD����>�B�������xZ�K��wB��O9m      �   �   x�M���0��� ��ӡ G44I���`�A���yI��;;
n<w<� 5��Oy��%�*��Q���O>c MH&R
�M~n�p�FB�by��m�0���p���w�sQk�U�)����1��
TM���½ٌ�++�lnH�����g����W"��5�Dj     