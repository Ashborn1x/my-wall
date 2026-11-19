import { FriendItem, SponsoredAdItem, WallPostItem } from '../types/wall';

export const JON_AVATAR = '/assets/aistudio/image_d0e5de4a.png';

export const OFFICE_PHOTOS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDTb2h3g_isQ-PwbRQRCEP5d2t-BymyqQNB_vYAkF8527HF08hnlx4xZBjdrB51yj6K23PRtV1vXliuBljQHS9rT2R3hN0FXq3JNz7C1FuCI2PUm6aIQEis0sO75ZzLr5OD5yk8do7avUeKwOw6YNecxONbRfV3H8WtVHXX_jQKzE5f0iJTj5j9Khv6Vd-n_PY3CcBkmhZDoFNk3ys8GiKICm-K9sSZv7UT1Vo0cg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCiW1DeN19WYfOyiC9NVWW-6k2CoLO37kqOK2arg3H84sZRXuIlh_2cAgT7PpRhFP3aG1K6bf1kDODJW94HQzcbFJiy4MIbE_lH8nNUrn1mxvMnyz-PNp5Wj2e7yxzSziKj0PUkyyeFA9yl0V33fJLU5_vjH7DNoTFmk6iqVbHFjsadg5elwB_ROZicKZKd9E8AzYcrGuGp8I1uScBKCe_cwhgwUkQCoj4sdyojXQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBUaA1saqoDjqlBJ-Em6FdM5xQAWRibx20tsXVKYnkeD0wxUsY8DurhfhTyBR-YZKB4y-z4Tu_viM_HBXTvEjZRTx-AO3q6oMbKGQtkmCM7Bdf9_hfkdqCLy6GOOmFy9graUCRkBMXbxO9Ku0RUdua2cFRp62eWu5LFKG5cI3UDx1yakx79EPPxtlrd-kUYWxeoQ5H212eXclwVv4ZDen3yTK_tSIzXOopnzCIPOA',
];

export const INITIAL_FRIENDS: FriendItem[] = [
  {
    id: 'f-1',
    name: 'Priscilla',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBnAqgg40ixG9hve0tJb65K73iducnKcNQnynmcDn4wAZzEdxGZ72884Tyhuj2jct5qsuTWZKeKC-HzwVrzXeaugwFNJlCvqCx5KOtoo3B_mFBtGky6YMSJiwS5XjK096ra_hDzBA2D3N1zamvllIun2NNNuLgRYS1iGxQXhOW2Wdoc5I6cAfMV-ET3o4J5GWW_dLi8Kh_YGF68iESpZFRNO9TlFSXqHJAiYeSrag',
  },
  {
    id: 'f-2',
    name: 'Robert',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCHMd4chnsrC6XXDwwFsS4gAdeSAAILllCD0bThRY-XF5IQLpYYNQ_WUXoXbpBillnQ4ga2by6MVCnLHeXP4NlzZFtl0LrbShmFxodFJdLAdKyfjaer6a3-uYkTG4z5dQEmkELbk8_oXzvjvUJ-5R2sux__f0E_bLTYQufiyK0My7JblYvrklhBBfAudfZKnfytesyerwW_TEEWPJb9PHzfcdpcD3B9P_K-kgwhOA',
  },
  {
    id: 'f-3',
    name: 'Eduardo',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDtlVL9b0qSMW1zyIQlIZaSuHDkSFwesS1nD_-ieJ6s4RrdaFR2pS00OWr_zYFVavZ5ABYa1wjOxvpBrSQN4Rzj8HL1AlbPIL39Yo6ru_u7hNtkzZugxAyjZLawwOmUgMe-sZ9FtVun_ZUGpwqnTJoABwqINKepxiKD2ILej5C5Mm3fTO3Wcbr7Wgh3i7KMP2oTq_-tTE1vVi3lNaLfJ3QpSOCDbm9tWhpKyygeew',
  },
  {
    id: 'f-4',
    name: 'Dustin',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCkwZROvRj6_dthrmXEaGX1JUUCeEJRPoC_OR1ZgmNCvkXyjEkR2MY48XOveWKMSxXnHWSKVGshhL5egxqtm9nVOc7sKMipjzhgTpO3vGF4hgYwbysq_Zk1J7_656aLQLr5yN3aVVgQWU1dc2jsC0Nj1JflQvHP9M-N607Uv8PZroiz-ey82FNP4csQHrThlHi7XHsHICqsAdajEfBAHTNwZDs4xPweoM92tfs55Q',
  },
  {
    id: 'f-5',
    name: 'Chris',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCJDi1Tvx905ar4L9BDg4x3Bcc6tvJ6FvWfbYD9ep5fSJTtJPWuawtyEzawBMuKn77v-OYKSQY3m12EvHrqgb3VRZUTPWk76nzTwnI59aq6Ih27-B9j7N88dbM9vlMa88cEwo5GY-_pQYSo27RqXX40RAUl3ow79lrrFvi4iqRwWL8_S_hL9k5cYhzBDW56UrlsVb9uj-xqjN9jWN43R-_tbdyGypMSHDK_6l-vyw',
  },
  {
    id: 'f-6',
    name: 'Sean',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBPkcQd8OQFymJhNRrq7zosm_7b7_myKfwFoufU1w-bbNmiUQTF1h6ZuKYBLQ1Evwyt3o_U227b2OrL8ayLOjzoxHGCGunmEOGzvm8bVLK9w67hQA78dp_bng43Y04AQ4jxYl2QSa7Wt5WWH2XDEoW4Qd6uznygoWaWhEO8EuULgeyhCD2kmUwro7dCZdzhQD64JJLPzJ9PnwxyXHFbpt4XvJGMzqbBIKt9-s-hvA',
  },
];

export const INITIAL_POSTS: WallPostItem[] = [
  {
    id: 'post-1',
    authorName: 'Priscilla Chan',
    authorAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDSrp085s778rxMq_u8iU6fXP-XM3TPH3b3iZYNjtmzyIwHgPrJoEhdUtst8SS1pzPX0RcuGCGceK-FKyW8t4TZQyqnsGZicCF1afpA-oFw1wH-m6j_TswJYfBqv2O_DxOwH9rxUUOzsnXgxU8C-7lk2CTJzzvf5HO0OblEJK0KVgMQrhRpfZhRYICgZx86slfLARwmuleGjXjwTCJWkZqHVmP125WVqUHHi4z7fw',
    content: 'hi!',
    timestamp: 'Sat at 10:52am',
    category: 'wall',
    likes: 0,
    likedByMe: false,
    showWallToWall: true,
    comments: [],
  },
  {
    id: 'post-2',
    authorName: 'Robert Scoble',
    authorAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAKw8zwgHwOyl6hWLroMI_xxIL2hdT0HHDYhJLc9dWT69po6-N4qJm9lMImFkb2BmY2e2sSzGiGll7JdwVopUcEVVaTrK77r2vAqHuXXnSnk-R7Gl99hH-7MlvavAihwALlrLHnQ926FZG24SpoO9T5Dao4BRvy0HR1D4WbiyXYLyK0dYeWNhwOESENo98NyubEVNoQP6rDd4npGJ6RLXv1g1XF3V9dTQcezAlkdw',
    content: '',
    timestamp: 'June 3 at 12:02am',
    category: 'photos',
    likes: 2,
    likedByMe: false,
    album: {
      title: "Photowalk around Facebook's new headquarters",
      description:
        "I visited Facebook's new headquarters today (they've been in there just a little more than a week now so I figured I should document what life was like on May 2, 2009). We were filming interviews for building43.com!",
      photos: OFFICE_PHOTOS,
      taggedUser: 'Jon Doe',
    },
    comments: [],
  },
  {
    id: 'post-3',
    authorName: 'Jon Doe',
    authorAvatar: JON_AVATAR,
    content:
      'Awesome -- famous actors and singers sing Andy Samberg songs at MTV Movie Awards... check it out!',
    timestamp: 'June 1 at 3:14pm',
    category: 'status',
    likes: 3,
    likedByMe: false,
    comments: [],
  },
  {
    id: 'post-4',
    authorName: 'Sean Parker',
    authorAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA6gVtVXbbCThZr7j3fnDWL1XF1Ra_FbMbot1i6IuRK64XS7W41f8fy6A6fUn2qc4JxgIM9HL6ZRQATCIVhVDpCeWtRy4Bnzl_s2FkLQAplXfHzakxFaBaQDyHZXaykSDSKa-rM2blc2ByaRUcTxb1XBrwctnMIyxXlPjsOif3JZsf4RC7MhbkecEbXA08fMKae2acM47j-FQUgqCiOg9XZAy39pbrxBMAj6FYHHQ',
    content:
      "A billion dollars isn't cool. You know what's cool? A retro 2008 Facebook wall rebuilt in pixel perfection! Congrats man!",
    timestamp: 'May 28 at 6:45pm',
    category: 'wall',
    likes: 4,
    likedByMe: false,
    showWallToWall: true,
    comments: [
      {
        id: 'c-1',
        authorName: 'Jon Doe',
        authorAvatar: JON_AVATAR,
        content: 'Haha thanks Sean! Drop by the office tomorrow!',
        timestamp: 'May 28 at 7:12pm',
        likes: 1,
        likedByMe: false,
      },
    ],
  },
];

export const SPONSORED_ADS: SponsoredAdItem[] = [
  {
    id: 'ad-1',
    title: 'Scuba Diving Vacations',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDRgl3y8E-CThz7MadXQzJhvYT4xJadX81cJGgb0jxXIszmSdQVfPPpffrqN11b9CT8TlPUS7cTgLp_69uP0ruRYQPVRIjpgLVZ6Xg_eaKyZNOH82WAnlHUhuDwFBZmjfJkantlCmMNySREipZnVALCYi62kBUG839TD6gjuAVzwdU71BW_QlEzIBvzwynXnXS2oDxlhEVCq2JxO9SCJ9ixZs47UARqwVUM21e_Hg',
    description:
      "Dive or Snorkel with Stuart Cove's Dive Bahamas in Nassau. World class walls, reefs and unforgettable shark dives! 800-879-9832",
  },
  {
    id: 'ad-2',
    title: 'Hard Drive Imaging?',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAssI8u8Mn66LAv3O_Pc_-1Y1aAJJipREALTICdT-k6SqLh5JOfJXEeQoAIScMNKEqeB8HS2KFvLRd83-6Lk0Dp0MWBZAcFxxydXCM4EvvigfCkxGOMUpoGOIIOdUc9Rk0XKu4dT3R7NfogtanN7W8Z4Us9M_Ztkx1Tqo6rIB5zqXD_D4I66aH1L73xXGCUqEN3MJwR4wFRWdxkJYfYZC0K6DoNvf9R14SKjE2-HQ',
    description:
      'True hardware-independent Windows imaging. Only one master image needed for easy deployment regardless of manufacturer.',
    ctaText: 'See how!',
  },
  {
    id: 'ad-3',
    title: 'Wedding Card Box',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCz0QLDhncsrHq6SjnjyvIjkCNLv8YDeFOSMztsbmHHuSj_-APUySOKtx7-K0J_e6U4HRtC1Jwj1a6zOHbM6o6OkMhOUfxBTOEFX1GB5TwKPIiuGHIHzcLjzNOyFN01ec6ZF9JjYWC9zjyD8uCZx-qc6lhOMmIvPlKRxTeVwwZBrwoMyWrRaD5uejy1FlVrZDzON_H8RD0osyJkpZ0S8cU_pmXXNy_wgXMVZdUDOA',
    description:
      'A beautiful, locking, rotating card box personalized with your photos. Free shipping this week only.',
  },
];
