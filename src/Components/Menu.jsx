// src/components/Menu.jsx
import { useState } from 'react';
import BookingModal from './BookingModal';

function Menu() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuItems = [
    {
      id: 1,
      name: "Authentic Sambar Feast",
      description: "Experience the traditional South Indian sambar made with fresh vegetables, lentils, and a special blend of spices. Served with crispy dosa, fluffy idli, and coconut chutney.",
      
      imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      serves: "Serves 300-400 people",
      duration: "2 hours dining experience"
    },
    {
      id: 2,
      name: "Spicy Mutton Curry",
      description: "Tender mutton slow-cooked in rich gravy with aromatic spices, onions, and tomatoes. This hearty curry is perfect with steamed rice, biryani, or flaky parathas.",
      
      imageUrl:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUSEhMWFhUXGBcaGBgYGBgaFxgYFxYYFhcYGBYaHSggGholGxcYITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0mICYvLy0tLS0tLS8tLy0tLS0tLS0tLTUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALwBCwMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAEBQMGAAIHAQj/xAA9EAACAQMDAgMGBAQFBAIDAAABAhEAAyEEEjEFQSJRYQYTMnGBkQehscFCUtHwFCNikuEVcoLxM6IXQ7L/xAAaAQACAwEBAAAAAAAAAAAAAAADBAABAgUG/8QALhEAAgIBBAECBAUFAQAAAAAAAQIAEQMEEiExQRMiBTJRYUJxgZGhFCPB8PGx/9oADAMBAAIRAxEAPwCssx868RG86C0+qnJxU9zqiL3rnfadY8Q1bJ86O0aVXj11TRljrqAZrYBg2PEZa+/GBQNi8d1LtR1lWNaafqAmqppZIqP0vGjy5AqvWeoKCJNM36skc1oXAmoT701guseKhTWoe9NbV23ati5JZ4PhgxnC+IGl8+f0l+8JjxbzNtL02+4kLj1xPy86h1WiuJ8alZ4JGD8jxTCz7QlVBDqcZEd4Mg5xmKYWeqJqgLcGSJGRkgmeJBGOfWkf6vPj9zjiG9BDwJVisd6A1V00767ovcwTADTiZiPI+VVy9cniujiyjKgdYuybTRkXv2BpxpL8ikbN2imOhcR61vdXcrZ9IxDetSG5ApRc1gUwa2sawOYBqE8XNKvNQtr9Cl2mpri7Oa92Bsg0M5lA7hhj5m1u4QKkS8aEvEoJ5FLz1tAatX3dSyoHcfG4a19+aWWOt2ziRRF7Wqo3dqsmu5moQ7NWttjQD9et8TRml1auJBqMdvcg5k9ySKB2nvUh1kGCKhu65am8ESBSDIbt4g4o3S3yRmlIvbmwKOJ2Car1AJZQkQi4xB5qI3z50N/jg/FCXNRmJqFwDIqWIxuauO9RnqHrS+5kUva+AYqw19TWwDuI7/UWbjFQoGc4k1EBT7Qqq2pHxGmHIxjgRdQXPJgKaQjk1MLa+f50HeZyc1oob1qqJ7MvgeIwW2tG29CCMGhenaBrnwqxPkBNWTpnsdrrhGy2VH+qs7WPRlMyDuIdTo2VZr3QaN7nE1ZdbaFtjZYbyhhyMCRyqnuQe/pTj2f1/T7Koty3eNxjEKu/gFi0yMQCYiawuUta+ZbIFG6uJWF6Y4E7iIFX3pvSVdQ3MxI+2Z/vis13tPoQl5ben3LtZUclQWY+BSLZExJnzgcUd7Ov4EPaIj6VyfiRahTRnTng8VKp1iw2lulWJZXkqZggHnd598079kdHvu+9mAIwAonGYUQPKMfnTf2ibfbKBQ+QCsDIPIntjvSPodk2JPiGD347flSZ1O/D94wuGxcfe0HQn1rpatkAIS5x5gCPzqE/hs5HxxTj8ONQbl3UMfJM/VifrxV9r0GgwqdOtj/bnJ1ORkyFQZy23+GH8zmiLP4ZKGnea6VWU76KfSA9Z/rOa638LUucuR9ags/hMiGRcb711GvKsY1AqpXqvd3Off8A4883NaN+HZHD10SaygnSYT4mxqco8zlnUfw7uspCv+VUzW/hBq9xIdT9DX0PWVvHp8afKJTah27M+aX/AAt1qZ8vnRDeyOrC7XQ19GkVo1lTyBWcmAP5m01LL4nyd1P2Vv2ySEaPkaB0+pvWTBBHzr64u9OttygpRr/YzSXfitL9hU9I1RNzX9QLupwLRXXcSRRv+GxIrrT/AIdWB/8AH4flSzVewNxfgafmK5uXSZQfaI2uqxkczlWq1BtZ20u/6u93wgV0TqvsxeQHda3fKqjZsLbch0Kn1EVhQVBLIbhdwbpot0mjZczUr2WJmRRGoJk7SIqOwzGZipvY+6boCa2rZB8VC6hBuNS2Oof5vuzTdunIc1C+w+6WADKXe6PcHGazTaK/O1EZvQCa697KfhffYBtXc/8AFf3NdN6V7LaewAFtjHpXWVMn4qnMfMg+S5wXoP4d63UwXT3a+uT9q6L0L8IbCQbxLn14+1dQS2BwIraihFHQgGzOfMTdO9mtPZACW1H0oL2t9obegtghNzsDsXgYiST5SRVmrlP4tu9zU2LISFCsQxwGZiJE+QAH+6g6lymMkS8CB8gBlP8AcsSHukZJuMIklHO/d8iWj5mlXVrIKM0FYnnEGIg9xVpsdYNrTNpjHiYchSIkECTyJC84AWq6+py5cEmDtO7AafET5yMes1xlIsFTOybogiKf+oNvXfaUDHwgQYHMACuh9A1i+6EZj0jJnHrVC6erFvebSwByIxBn84FXHpOuW4NiIczIIA+URQ9cLHAloOKMdM5Y7wefzoPqNliPLvjv6UXoWIJVlgg9+f8Ams6iZiBJNcQEq8Y3VGH4ViL2o/7U/wD6af1FdKrgml6ld02pVrTlWAM4kQRmV7/812b2Z6mdRp1usIaWU+RKkqSPQx+1ev8Ah+YHGE8zia3GQ5fwY0Jqtj250W8qbpEGNxRtn+6Ij1OKa9d01y7ZdLT7GKkSRIyCCD3HzHFcBGocz35+WMVvV6h8RG0StLp1y3ZnVtR+JukAPu1uO2YG3aD5GScD6d+Kq1r8UtSu4NatvM7Yldh7YzvHpj51R71xjELBjBGOcT96adN0ipHvrLuGAgggCZjkkYjP3z2Kb6vJ2T+kcGjxKOrm1/2g1Wqcl7zb5AUSVUljhREKvzNXH2F9pLtu6tvU3R7q4rQ1x/hdIJG5jjkiD3GODVRXTBrrBU2bvWSPIHzjzqD3AVbisVLbpJmTHzM98nvjnOQJn2tuHc3k04I2+J9CLdBJUESACR3APH6H7VvVY9huq6e5pkW28uqj3m/DloyzTkg9j5RVmmu8j7lucVhRqe1lZWVuVMrKysqSTK8ivaypJNWtg8iaW63oFi78dtT9KaVlSSULq34Z6e5JSUPpiqR1n8MdVbk2n3DyODXdK8ihthQ+IVc7r0Z8q63o97TNuu2mB84kfegm9oCDAmK+rNX0y1cEOgP0qt3vw70TMWNlc+lCOlQmzDrrGEt4Fe1lZTMTmVlZWVJJlc9/FrVhVsLtyWYh/LEFY5ySD/410KuOfiHqblvWLavObq/GgaAoVyfCdontH2pXVn+2R9YfTj+4DKjqDjcSC0iD3nvjy9PlS/UIXO0HJOf3HzphesiYEjuJ7GJwfn/fepbWhDhTOZbEdwJyeM9p8jXHU1O7Qq5H060VRtvwk5OZgxAMHjBx61YtK1kBWDDeVURBUcAHMbZGQTPr60stWdqMFOSQCJwcQpAk5kNz/N5UT1VwtxdoUN4Q6giN6gjcQBtE84JGfmBT+4G5ji6Esul6oCCWAA4Q4JMEA47xPNKup9Y8DbRDDziImMZ5/p9gLI3OQzCcGRLCIU8Dk4g1H1ISxKzcQckLtIUfzYwQOT+tLeihPUgABio9TUEsIYnbnyjn5EmurexPXltaHbdZS1tdygHLW2G4HPMMWUx/LXH9N0sq+GUqQSBkTGSJEwf79K9suwwxypwCAREzEzx6V0cWQYjawGfH6vE6jrfxDuQzLbUKAZnNc7s2CbauAxGNxEBQSTIjniM/PGKhCe8TYpMk+IyIAxHPJmazqGma2RbtOXg+JQfD6HyrOTKcvZl4cQxniGLoDiGSY5n4Rzn1/emuquG6qoqkgfxvMg44HJz3NIjeNs23dDt4J9Z/hyJ8/rVnT2hsmFsq5nuVAX0khjzSOcOKKi4zdxIl8ae7413TjyweSB58+VAjTotyZubN25JPhBkEyI8WJ/KiupqWun3nxcwOQORB86FW6NyHDQDgg4kRx+/youIkD71zMst8x5ZvbWBw0xIBgsAcgkExPyqw9F/Ea5bi3etSi+HdJ3iON3Y+XaqVYvMAzAAt6lZHqF/v8qCtave7nfxysE7T3yTnzB/pRMJyY7KmByYsbcMJ2XWe2RKxZsuWcRbOGBPnCnIjNNfZvrgv2gXKi4uHHqO8eRrjB6hvtrbBIgkkgAfLI7170/WG1uKs2+MQcf8AkO/ejLrcqtZN/aKtovbxO+++XzH3r33o864BqOv31cN7xscicTVl6Z197kNuP3q8vxV8YvZY/OVj0BfzOs+9Fbg1VuldTBEE05takdjS+n+O7z71qL5dMyGoxrKgt3qlVq7mHU48otTFyCJtWVlZR5UysrKypJMrKyvJqST2srzdQuv162ka43CqWPyAnv8AKhvlRBbGWAT1Cpriv4ovv1zm2N5S2itGdpAYkGOKB9p/a3VapTd3m3YdmVbSmICHliMkyDzjyquW9QwyjwWEmGPBGZ757z50hqNRvG0CdDT6Yr7iZtp2KhnaYYwJzEj4QZx8JNONJ1K0SVJgBTtaMFoIE4MHJyPIfOq7asMTvPHr3qe3cCsGwwHaMY8xSbAXceHIqMuq6xAUuW2BUjKxEEFlBAPJ2hSTnLHNTNrlQEnLkgmNpTbAaNymZmODmOxFJtVprd0bhCTzEfaPKtblzaqogkiCcyQR6R+lTaG6mS+0cyxdP6oFul9pths+BfhMGIUkY+tMbHU7iKGtgbW2hsyYC7WVhMLuAY/CDkkela0+rYsS0ZjaRMiDknsTxU69Qgxt8SyDmJER+YNBIZTYm9qMIdc0KndtwoPLBiwG05xjJ8/TPNa3NCp8XFuIGQxnPPr8hio7mruXIT4V4HcGZ585jtRD3AttbVyCqzCgD4gSJYrn7k1izXP8TXniCpcC7giww7+cj4Y47zNSreAQ3Mb+YInJMRGQcH0/KodRaRoKMdoIUY5J4Ex6GJPY1Fp1Zl94DkcYEgTHhHn/AH2qwOjLqRaTUOQxdYUEhVmRDAgkzxOazSsqbgO8GB2g9hOZnj0o/p9wBWU2948yIc5BEHMHA4xBI7zQPUkQG2EV97A7ge5JhQg57H/3RfmND9pBx3N+qXEFu2ZgmSxmZ/p5R6VF0nSe9O58IASBJE+hxkn9qAv2gH8WRIP70VZ1DJ8M7Z7eZHHz/rV7aWhAs/uCxkOnQxhhBJyD5j4cmYiRn96h1vSfFvCxuG0cQQMzIOcgmf61Je1aq1uAWO3IOAGI7ZyJjOJiptZ1WVClIAwucAZBnvOR3xB+gwXBsTZW4p6fcUHbckAc7Yn6TimXTLZuF9qFmVdxiICD4iR9uK96bqLap707SUnctwgowb4di84yTSSz1nbd3KSORgED5fKiHGGJoSgxK15jbXKpLAACdpBzitem633J2Gl1rX3C4UkKD5icVAWG/mc81oJSC5QFvOh6DX4BFPNH1E9zXOU6iyqIGPOjdL1ozBJA86Vz48bD5IRcZY9zp+n6lHemOn6oO9c9t6qVw0n0NaL1V0PNc5XKH+3YkbQq4nWLOrVu9EA1zfQ9dxzmrJ0zrwOGrtaP4q3WYfrOZm0LJysstZUdq8GEit67ysGFiIkVIG1HlS7qHUSoMVxbqXtvqLplLjqTyowonjPegtB12/M3tQ6rB48RJCmBnzMCe3PauFqTqci0HqPYtOLsidI13tqLakkSQYifrVV9ofbK5qrRtICittDd2Ocj5Gq4w983iJALck4k/Ic8VCNQbJG0gzOCASOY3A+o/IUFMCA8kk/5jOyj1COqbCyqJ8KiZ8zmlr22LAhdztwP4VHqO5MYFNrNqVL8kncxPbt9T6D9KBd/eN/l8+fEx2gkRz3ouMkcQzDjiQe+KiGgmeZkT+laWbZYwss57D8qzaSZcAYwI9In1NF2tAWkqZIEkDsMZIjjI+4olgSC4FeZ7cljPGCF9ZEnv/zUOv1W3KQBnwyGx3G7ExTvR9PF5tpiFgkA5bxcTnMHsO1Mb3s/b1IFtbZUqWHxElvUzxjFUdRjX5oLJgZgRK7oEZTu48g3J8oHeiNLqCzOSMz5eXH7VNremNaOZ2iNkGQfMfOor1ySWBA38AziAMHEeWJxH3q1cbhLw4vSG2456f1F3Rt5XbthZjA8UQkfUmJxyKhsqQCQ3AMdifX7wft6UL0QOqsoRbhJwNm4gc4PY47dt1EQ1xlMwoknYPh8UmV4MCY9IFYZVBhQTzUG1DPsDkjYm1MEFQckEbc7vERPpg8V70S6SqIz7FOCYnzIle/zqPVaRXYrbdiuDxjcPPyjz9ak/wAFFl2DkXQVAAUlSdxnx/CePng+c0U7XACzIUqSTLJevQhWFBWRDZC7gpJZwAGJYETjDCJqtXrrPcG4wexA+GB4QPIYz6A0f0vVkNBy5BieCGEZn0PPaKG6pp1w0FcjdJ7SJ7epoCmmqE6g3U9KbahgxKtmCPhIJB+eR+da6a4bbg8HBBBxIODJ5HNSaa8HJTcGBBC4OCRjw7ompdD0xnJUmCCARHAGTPcY+dbchR7uJnaGhNq7byWBZmJzIgAntQuvIIUeIJmZzEnsO1F67pz2pXeIhTPzEgEeeRS8wQqzMTgY4ggmB+Zmg46PIM1U9dyLW5WWAwxiRtEqwB5BA/L1qLRj/F3bj3GRTBcliFBI7D1NH9K0qXWKtCrDNgbogdgT4sxjnNIPaTptwMoQhQQZABBmeCOxppACa6uAsjqC6vUzdCJJP6VbE0lhEG1C9zbljO3IMnz3Ax6UP7O9Otpa2lZY5LRP/wBu1NG0S7RtuRzhpwI70PJlHyp4hkQnlovRoiI7jI86hayJhpHpRtuWcqYOD8sVqiyYbCyJ+XnnypcRkgCC6mFC+7iQSQwJDEeomnFvW27qgq3ijxA+fetLOlRkYKvvNu7xDGCYU5+dJNJcFpirLE+eQK0+MOOe4JXKn2y0WrMCdwo7SawrVVu6s2DkAg5weREzXlv2hTnIPlRMemxlbgnzZCep0/o/XSpzxVrt9XtkAzXJNBrTctNdGAnPoPOprfWhA8Y+9OYbxcI3H3iOXGHNkTm9jcGPbzPkKkfJAnEjn55onZK7924+XlgY+8/apel6L3wYEgeU9og89sT/AGaEzAEmOIOI60NkPYKAGRJBmAufDA5mZJpOmhAbxthW5XPaZ+360x6dKkrJC8H5eeeaF6nfO47ySwEeW4CYJ8z684oGNuTUIwqQXHMs2dpgAbpgZ2j7Dg1a+h6PdojvuDaSxCMudxwGUk5HngcHPnVtJocFpnOMjj/t/en1yzcC2FthXkErsYyGA3EP4vCV+Q+tEsWRBMOBRlf1dxJAQGccxz3+lMLGnUoSdu+VgGR3yQQIJ5wYiccRS7qdxDeU2gZIysZUjHPBnnBPNOdLeAXxZPfufvQspOMCocURcL6TofeWW2fGpMIqyzxBLFpwFE9v1qRDctkOwhBCtIHxEtB8/hEExEioLGstplcHIwY/vvUn/VWMw5+jHz7fWlWbd2suj4M09ptej21RQGacQPU+KfrSXSI44BmI48+flR516xnaNvpmJntk/wBiotT1cwTaxGDHrgfX0omMMo2qJk0IRoH/AMPd3yQCrcdjtgGJHfP9aH0utAuMjgMCZysCJB4HH0oPSIG3XNQTtMKfEV2r/EZDd+DM/rUuq0AtLauBywcnOCMwRB7yDTBX20TcyGBaqjG3pIygHcxAMCM/b/mmV27ZW0Nh+EAlWtFt3ZgzTGyZwR2EcVD0W0WVngwBGPMzj7Cl17W+JlG8NwNpgEHJkgj1xmgYmYMQZp13fpANRpXQB1YndO1cGBOccqImAfSvLqs5AYsVKgy0YnKyVxIIiDHyFH9PQteti8Ts3HJkhV5xjJgeWTUvWeoguUtN4UNvlQNzFd3EZjueMimhZFj9/MEeCFiv8NtBFxrjwSp8G4mJiCSFzMxAz9atvVeo2y25QouhYMTtO0FgTIHi5BHMxz2qdyzcT/NUA2yZJjAcjdEQMc/7ewIlmure5tUNEdlwO5O4Dmsak7mtvP8AiXgxgCxN9ToGvAklgGzyJkiTPb/1Rmm6baS3DSmcsBukR5SDOD8/pTR7gUG2u1gsQ0xKsRG0GDJnMzH0qqde6g7F1DqrwTLNztxC+ZzgCllVi23/AJCg7gT1AbakX3C4XDIPpJI+1S6zqFzUMhvEkgwpJljMCGn5Y+dQdO1QFsLcfPfGDtHhI8z8XOM1pqiHaUMD+YgLMCAdqzBgeZpzmzBAWbjo313HPeOAB4cHC4j5E1KOp6dVyjBo5BET2xSe1prvuQV2so7EQ6yYMHBPHrgn1oEHJxkUIYwCSIUNYqNtRrBcbwjaB5GpdP1FZK3lJUgDcBkfTvSZ0IAbIPPGCO1F6TWM0rcfbugyZhowAY9KmzzLLeJLotcvvS23BkbQInyI8jUXV7i52zg9+eMj71IukTdJ424YSM/LvB/Sg2cFtpH79v3NWKJ4mW45gtzWFiAxLSAM9o4AqBrAnmKOewNoZojIgc0NesDZKyaMGHiYBkf+MuIrIHIVviAODHnQvvz/ADGvTcGAawijDiQxnp8rsWJYxOY+sfWnPSdJggyBxxycflE/lVT6Pd2uLbMBBz5N6TVu0euHvYBUgyADwC0CaV1KspofnLwniPdCFAIIEjEgY47/AJ/eq37XaVP/AJLMyB4knAE8gzPJGKtnWNMbVkOrEoVO8qQBvIwD3IgsM4P0qk6O+H94igXCYadxgBVZuAYmJyeADiTNC0+JkfcTMOQwsSuaP2lu6eBE8GCeVnANEan2sa6oBGBnbPhU+lBdY6Y7kOM7ue35eX9K00/sy7NtLKo7sZgRzn6iuuFwMNx7im7OrUORN9H1i4bu6NxPnxFXTo5S8RBgnBBPnwPv3qvWOkLbJVCXMCT2nvBPajbWnAzkNuHHBXv9ZFKaj02PEYT1K5lk1HQ4usiOpABJJMACYIk8kT25qC90pwyj3i/7lCiI5Jgf2am0WqIXxw8z2yR84mjbuptbSwBX+UHxdvhJIyOZmkS/MZQkCLL2lXaeIAk5G49o9TP6Uk1moJARLZ5kwMczz3OBTLqN8xEZkQfpwfy+VLddrYQicDLH+/rRcQ5g8lVFXVr82hJiSPDJgiZzXl7V3rNtGBD6czCmZtN3Q+XmBkEfKlemY3r25pNuSI/v70xFxrYdLqgowgQeGGUYeuI+1dPaFAU8/b/fMQZyx9RZbfZ7WvcCKmIXxZAJUknnk/FEgTApgSquQQVwcCefIycCc48qoZdtgZQ0Bjtfjb/pP3H3oyzqLzlUcsq4liSQAe8DMd8Ulk01mwZ0BkUyyjq1tLu0hmtOCHjaX4MQOAf6Uf0HpVu5Je4of3ZdQWACghSA24QrEnj0n5VbQabxLkAkxJ4E/wAR8xGfpTfpmpC6hm3Hbt2TBuSolSQGghYZmgQRJyIq0Cr3KcEixG/Ub5ZLiuyqpkCTuj4k2h5LbRkjJH0oPoGwn/MJwIERJgY55z50H1HUKlplVQ251VMcrJloPwwM5MiRROkUWl3lsgYx6HI7cj86Vy2RZ8mESqIEY9R6wLO65JCkMsbjG1pIQE8nk1SeoXbd+5vBgAAZPiYySTAPrH0rT2i1w1DhLQLMGyx+ESI5HkaM6T0YhPGQM5PJHJgKMjg8wMc5pnHiGNdx7MBkfnaOofoBZIW2dpGWYMDMdgpJntMgAiT2r3rHR1Kh7UhR4mQmIxjkww8j8/oG+lhlKMZGQzGPlGTH0PerBqNZZW2YBLEZDL8MjI3HtP6A0JnIYEGb28Sp6bUOOJPqeQBHHcH1FFWnHxgwQe4mfMVC1jeCbWBJz37Tz2makS08GWWRg9m9TwAfvRGo9TY65jDYt23cuqAvEINxA8Q4+h/iP50ruWeVPrBH3mjNHKK4JUjbIkZnmKT6vqoJESAeSRA9YrKKSfbIWocxveK27CMj7naVKHMRB3z2GYj0pbo2JJNBPqVO5lHYDdwcc1sLwVQFOfSi+nQ+8Ep+sfMiso2SGkzORtjt680PeItypy3EcVD0rwjduIPY+VRdR08qSTJBEeZB/WhqgLbbm24FiaPpNw3YEetQR61ltoEcVrt9aNzKAivU2A3f8q30Wqu2SrBpA9ciPL1qZ8HII+lTA2wJg/Wmd/FEXAHHzYMM9pPaI37SW7bkTl8mZI8RJ9f2pf0dCiEf6pmOZER+VDXCk/D+VN+lOjIIYT5HtHpzWWpMdAcSlUHJZPMnt6vaQGBzjBAJU42/cg/Typ9pc52WlWI8e5mAPAHcmFI/pIpLdtbhIxB5jn5eVbWLYYbZgg8zHf8AixmlCQRGNphrptAuWySJA+fh8XbGceoNF27Ny8guJaUAQDJyxEktHJmDNT9JtoFIvsRILLC8j+cT8QGMetQanq1xUKm2u4gbHBYSCqsZWMYI4OfQUI7m4AEuwOzPdVq7dogtdC8hViciBMqSG8oHnUdrqFmD4mc/JjB8vhx8qG0WiRnW5cdj4ZYQRLSICkAwJmDPbMVZbtkIga2FH8padxGc+XMn51nIiKK/8/5NBj+krGou3Lpi3ZOIy42qJ7nd2qoe0N7IT3gZpO4KPAM4APc1beqXbtwFWY9zAwPtVW6z0zbBjkAz6GRT2jKAxTVWVoRZ0/Vtaaex8xIqypsv2z5juD/fpSEqpXacDt/7ph0Me73hjxBAn7H1pnOARuHYi+m3KdrdQzod0o5tt8s8GRB+ppvqLiBwwDbRyABIwfXifr6HilWnI94ykdgfnOcU301qJkLDAT6ffg4pHMRv3GdDEPbQh2j6aUV7lxHCqPijbC7gNwzklSYnt2gCc0+ruWxO9ZDQJA3gZ/ighlj1g7uDFTpprXu/82+VJyq7cMAUkbpBJ8TGBPFTaL3QW6Ia7Cstrcbhg4EqAoyS0Hgc8gxVUGFzNkHmRdNQ3bio6RMlRuAMGILHMCO3PizQHXtQVW4qnwwwWQNwxGYMbpI+ophchBDKd0LGQRugBiSPPJ+tV3Wm5duhFX/LzPJ2BYPPAE/rQsYBa66hjYEk9m9B/hyfegsGXIHAJU7cmQYJB+lNXtkGVMLJAPMkdpnv+lMLjL7hSVEhVVtsGSogGQTz3+dJ0tFuJA7+nArLZS7EmRMdCG6bXGCCqAGBMHjPfyj9KKvBD4bqyok4kSOB6+Rj50M94INsysDdmQOcAlf68UFc1e8bUbMwFUZ4gZ8v+aHtLNc2BSwywVNsptJEzIxAiOI+XPlStFU3Pd7tyrEQZAZhOfWMfOvf8U6o+5oYKcn4cT6YpRoeu2gFkNvLAsTAHzntTGPE5BI5gnyqDXUZa3UC3bLQSfLPcx9qWazTblDkc59JNTNq/eXG4NkYEcMR3k5imSspAB4rVnFX1k2+pKvdUghDj0oi2sRTDqV9EMQCDPI/Sl6nuBApgOWW6lYsYBowlW9YrRlJiDkVqtyiFcDtWDxCvQE3bS3RJZeOeMDzgVGtljkFfzr2HYkyfpPFaC1GKqL3JdQ3aRmaGe0PWOasnWuivYYq9vaR+fy86Vt0+5G4gCe3f5wKymQeeJp1scRObqN4QMetNehdORmb4VbkE8QP3oM2ihyAZ8h/eai1OrK4VZBjJmREwfzo593CxZMQQ7m5Mt3UdtkhFLFmA3HHwmDGPp60GtksVW3aIfMknDDuSGwsCTM170LV27g94+W4YEBoxAwTx/fybI+595XcuWayf8tdoO4MCrQRmYB5pYKF7je4xOdWAT7wSBnsviUjuIIXziOZrxWXabrEFo2opI4YMFKCcwf1HnWazRq03IAjlRMZwTOcT6zR2mtILtprm0FkcqAIA2GA0DwwciIxFUXAFynWEaJFtqPfCTgBQOIIORPpR+q6j7zxOEWJjaAMf3jvxSrVspYgHnBJj0x+vfv9wLjgE2zkT8XcCcx+eDQgCyzDDnmG3dSiyAC0c4JxEkk57D8qr3tBeBt7lGOFzmOftTE30XVkG5Fn3g3NbmDbBHAHJifrNB9dtgJgEbixUHnaSduPlR8WMIwMERu4lbUzUd0EMI84/aibKEcV5q1AWe/95roBuZWRDsj/AF/SntoHQgxEzAO3aAR6mRj515pX3Cd2PXn0+VNbl5m04B5Cr85J7+sVpa6KTcdVbaQPENsiDBnMQMjkwK5wyWvv7gtC7m76mWHQ7feZUfy4PkPFBj7V5bs7biEPJZZEEiPFwZ4PhB+1eXtK+mf3dwAHxjecDMrxMjv5zPeodTdkhrTzcSZUgkbVEkw3eZwP3AqDGTwI+2Vb5jbqF4Lb2kQVkcky24k5EiIgUF0e0LNoXmMFyQDtkYJXwk/xcnzpZq9ZvVLYQljGMznvPYZ/KnWqvAWlstKhCVPGXGPD9ZrBVlUA+T/EDlyEuq4z+czSXCk7RO6RtbyiAwAwO8yTyI86ZaIsQ0RbIKkAcEiAAZMc8T5k0HYvbiAB4lyT3PhA+0z96cC45AB2KIADbVGCIhowwgDmcgTmhFgGjVGorGnUglzBI/LsAIHaPtWl27bVgNu2AJ25J7Tzj9sn0oTW6k5z4h3mTM+ffNItR7QAEgGfMnk5mt48LvNu6KOTLF1o2/dydq7phe+TEc+tV3/otrsI+ppfeu/4hlYE4+Ld3PoB2pzY1rIAAR9aYGN8S0p5iorKb8SbR6JCNgwV7zz9KIfRqo9fOf2oG9r2MZHM4EfmKj1PUN2APrP7UIo5Pc25GIWTxNbg5DDioXST2+VaC8QeRUbOe00wFMU/q8f1k/uzzXoEZkQPvUP+I88etS2bg5AI+cEft+9XtPmaOcVNLuugQIPlRdggqPAOPOh2QSSIP5c+QOT9KJ8Pmf7+lU1ASlG/kGfTfU+k2r67bqBh28wfMHsaontN7D3stpyHB/hMBo9Dwa29i/xb0msCpePuLxjwufCT/pfg/Iwa6LbuBhIMins2lx5eWHP1nOxZ3xH2mfNl7pz22YXU2kdmwfzpXft7zuAjtjvX011To1jUrsvWlceo4+R5FULrH4TWzJ0tzZ/ofxD6NzSh0robHM6Ca3G/DipxNUay+5WgfxDzzxVh0XUoWDLpDAA7oBIk8Htk0f1b2Iv2Awu2Wj+cSyn5bf3pVotMpMMsA4xnnHegZHB+bsRpK/CbEJ6U63nI37dqM3xAEkDAXPJ9PWlesuNbub4YqF2JPAkyR96eL0+2g2BFz3MflQ2os5ZBECDgmD2+H60FMqXx1NMpPcR2dXc3AohBzMTB7Yppd6pbViAHUf6lG7IyCR6zn5UVpL2xT4IYT4+/2/sUPqbquBAgcyVG75YopZW8TG03BBqrfK8/KPvQt1izS3PHOI8vlU1u00mB/SpHt4jaD54mrBCniFVRF9/TkEbe9Q3dJgyaYNcJMAfYVj2gR6n9KIHIlOl8TfpN+5dKoz+FWHkB5Z86tWn6bv8AHIBnEGCc9vPiqtoX90T4fDg/t/fyqyJ1cN4kmI4BBzxP6YpTVBibWTBjCcCb63TwIcErgHHxQfLBNBv05dqEJ4DAMjG5pKT2BkGKJ6h1u8yqr7iMbcLMdgMZ4ofVOzqp5IMnCqd08Fk+Q+KTM1nGrAcmoprsZego5m2h0otkl1lT2ECYnJMGT86X9UNsMeRIk4ESSSYHlx5VI3VkG4EXBCnaMN/mAfxYEgkdiI9aTWka7ekcTgGPzHlRkxte5zxBafHkD8iG6e7esgXo32nBGCp+AbjMHEAgmfMUSvtSJPhM9wwHPyn9qX3eni2SVuZzMAjBwRzwRzRWpuu9gW2W2YiDsTeoCgQHjd2HLHvRSuB+THqyrxK/1LUG5ckzB4Ax8jQ9jSGf1+vrTSzpJzGO+Pzoq3pxMpDffHoaN6wUUsEcW5raCJb2/D/xUtssfiAn0o0pu8vtQ7oOAMUDfuhlUL1NGjtH9+taX9IQs53H6g1MqqBwZ+R/Kt1TGQY+1TcRLyKuQURF9u00wVn0qU2DPhG0980y01hedxmOM1u2lBHBGPofWTVHNzFBpFAqV+7afcNxmmWls7yZIX6GPpijbGnEgHj70U9vdwdsAc4x5YFU+axMnR7jRPEV2tNJwKL/AMEe1NdHo5wZGPKm1rorEAxSeXVBTyZ00wKoqcVOnbyP7CrT7M/iDrtAQtq7vtj/APXclljyU8r9DHpUvW/aO86tp1FuzZBI93aQIpg/xHJP3qqaq2BxXosbluxU4WfTjGLE+hPZj8btHehdUrad/P4rc/8AcMj6gV0np3VLOoQPZupcU8FWBH5V8VUZ0rql7TvvsXXtt5oxE/McH60WJz7UikvVfZLSajL2VDfzL4W+4rmP4VfiJrdU5s32RwseLbDn5kED8q7PbaRNYZVbgibDMhtTUoWr/DdQd1q6fk+fzH9Kr/WPYm+hLCzPrbgn7cmuwV5Sb/DsTG1sfkYymuyr3z+c+eb+guKT7wMuY8SwT9/2oDUrJwgAivpG9p1cQyhh6gH9aTar2S0bzNhVJ7r4f0pdvh7rypB/iNr8RU/Mv7TgP+HK5k/36RXvuzwASJrpntH7JWLQJRrg9NwI/Na5j1/WXNNBtMRuwZg9z/SlwrltnFxoZlK7hMSx5yD6Qf7FerpvFBAA7nyx+tTWH3IHIEmPlUto5OB598T5Z4oZc8w6iAPpfFBBHr/x9KltaVniDt7Dz+1H2gGmRx/z/SoNTqmF3aIiR8zgcmq9QngTXmS6QBVi40gAgYn1gfWvbt1jENMCB5ATMBfL+grbUJJJNbPp1FsNEkzz6RH61kMT3IVHcBsxukr2PbB9OPr9Kit2jukQfPz+RqVBOT51j2QsMOfOibvEm0DmQLpS7bZ7ngiMTMEmPzr1guQPmAP0+VS2LYIk/wByDWgtSWEkQpIiP6VoG4DM5EV9P1DhypMHiPKjgGBMkfTM0vQlX3TJODMZ8qZ2Lm5sgD5YouXg3UX07FvM8UzuBBiPpk/f/wBVvfsrjHPY8US9keVQG0Njt3BAH1xQA1niOKtz25aVO4acfP1Hp9qi54gUVYsAlZzxVl1HRLUoACJ8j6etDOQKQPrIwCyoHSsWnmeYnk+dTJb8OwrJnBnt3FdZ6H7B6R1DuLjH/ugf/UCrTofZzS2f/jsID5xJ+5zTyaXJkF2Im+uxoaomcT6f0PUXYW1ad1Bxg7fvwKtfS/w8vsZusls/Pc0fIdvrXRL+mA4JAljAwOGPArxkIkBmzJ5/0mjroE/GSf4iz/Ech+UARX0z2K01rLTcb/UYH+0VYE0qAQEUAegoZLIyCSQVMyZmQB3pPqOr3LTFF2wIiQZ4nzplMGJPlURNsmTIbZjP/9k=",
  
      serves: "Serves 400-500 people",
      duration: "3 hours preparation & dining"
    },
    {
      id: 4,
      name: "Testy Sambar",
      description: "Tender mutton slow-cooked in rich gravy with aromatic spices, onions, and tomatoes. This hearty curry is perfect with steamed rice, biryani, or flaky parathas.",
      imageUrl:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      serves: "Serves 400-600 people",
      duration: "3-4 hours dining experience"  
    },
    {
      id: 5,
      name: "Mutton Curry ",
      description: "Tender mutton slow-cooked in rich gravy with aromatic spices, onions, and tomatoes. This hearty curry is perfect with steamed rice, biryani, or flaky parathas.",
      
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtV0r5l1f_Pwqzr5g2haep-HXl2kPsxJ1gKg&s",
      serves: "Serves 400-800 people",
      duration: "3-4 hours dining experience"
    },
  
    
    {
      id: 7,
      name: "Coastal Seafood Extravaganza",
      description: "Fresh catch of the day prepared with coastal spices and coconut. Includes Grilled Pomfret, Prawn Curry, Fish Fry, Crab Masala, and traditional seafood delicacies from both Andhra and Kerala styles.",
    
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      serves: "Serves 200-600 people",
      duration: "3-4 hours dining experience"
    },
    {
      id: 8,
      name: "Traditional Wedding Banquet",
      description: "Grand feast perfect for special occasions. Includes multiple courses: appetizers, main courses with both vegetarian and non-vegetarian options, breads, rice dishes, and an assortment of Indian desserts.",
      
      imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      serves: "Serves 800-1000 people",
      duration: "4-5 hours celebration"
    },
    {
      id: 9,
      name: "European Gourmet Experience",
      description: "Sophisticated 4-course European meal featuring Continental classics. Includes appetizers, soups, main courses with imported ingredients, and decadent desserts. Perfect for formal dinners and special anniversaries.",
      imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      serves: "Serves 400 people",
      duration: "3 hours fine dining"
    }
  ];

  const handleBookClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <>
      <section className="menu" id="menu">
        <h2>Our Signature Dishes</h2>
        <div className="menu-items">
          {menuItems.map((item) => (
            <div key={item.id} className="menu-card">
              <img src={item.imageUrl} alt={item.name} />
              <div className="menu-card-content">
                <h3>{item.name}</h3>
                <p className="description">{item.description}</p>
                <div className="menu-details">
                  <span className="serves">👥 {item.serves}</span>
                  <span className="duration">⏰ {item.duration}</span>
                </div>
                <p className="price">{item.price}</p>
                <button 
                  className="book-button"
                  onClick={() => handleBookClick(item)}
                >
                  Order This Dish
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedItem={selectedItem}
      />
    </>
  );
}

export default Menu;