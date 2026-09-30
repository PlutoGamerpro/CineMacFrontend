export function unsplashImage(photoId: string, width: number, height: number): string {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

export const FILM_IMAGES = {
  shadowGuardian: unsplashImage('photo-1536440136628-849c177e76a1', 400, 600),
  shadowGuardianHero: unsplashImage('photo-1536440136628-849c177e76a1', 1600, 900),
  endOfTheWorld: unsplashImage('photo-1446776811953-b23d57bd21aa', 400, 600),
  queenOfTheNight: unsplashImage('photo-1518676590629-3dcbd9c5a5c9', 400, 600),
  frimannFamily: unsplashImage('photo-1527529482837-4698179dc6ce', 400, 600),
  livingDarkness: unsplashImage('photo-1509347528160-9a9e33742cdb', 400, 600),
  polarBearsSecret: unsplashImage('photo-1574267432553-4b4628081c31', 400, 600),
  greatBreak: unsplashImage('photo-1516979187457-637abb4f9353', 400, 600),
  stormWatch: unsplashImage('photo-1506157786151-b8491531f063', 400, 600),
  loveUnderTheStars: unsplashImage('photo-1682687220742-aba13b6e50ba', 400, 600),
} as const;

export const CINEMA_IMAGES = {
  aboutHero: unsplashImage('photo-1485095329183-d0797cdc5676', 1600, 600),
  facilitiesHero: unsplashImage('photo-1595769816263-9b910be24d5f', 1400, 600),
} as const;
